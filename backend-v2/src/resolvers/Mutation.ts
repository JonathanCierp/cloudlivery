// Classes
import Auth from "../class/auth/Auth"
import CustomError from "../class/error/CustomError"
import Mail from "../class/mail/Mail"
import Scraping from "../class/scraping/Scraping"
// Utils
import {mutationType, stringArg, booleanArg} from "@nexus/schema"
import {hash} from "bcryptjs"

export const Mutation = mutationType({
	definition(t) {
		t.field("signup", {
			type: "Default",
			args: {
				civilite: stringArg({nullable: false}),
				firstname: stringArg({nullable: false}),
				lastname: stringArg({nullable: false}),
				email: stringArg({nullable: false}),
				password: stringArg({nullable: false})
			},
			resolve: async (_parent, {civilite, firstname, lastname, email, password}, ctx) => {
				const auth = new Auth()
				auth.ctx = ctx
				auth.password = password
				auth.hashedPassword = await auth.hashPassword()
				auth.data = {email}

				if (await auth.getPrismaUser()) {
					throw new Error("Un utilisateur existe déjà pour ce mail.")
				}
				if (email === "") {
					throw new Error("L'email ne peut pas être vide.")
				}
				if (!email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
					throw new Error("L'email est invalide.")
				}
				if (password === "") {
					throw new Error("Le mot de passe ne peut pas être vide.")
				}

				auth.user = {
					civilite,
					lastname,
					firstname,
					email,
					password: auth.hashedPassword,
				}
				await auth.createUser()

				return {
					message: "Compte enregistré avec succès."
				}
			}
		})
		t.field("signin", {
			type: "AuthPayload",
			args: {
				email: stringArg({nullable: false}),
				password: stringArg({nullable: false}),
				rememberMe: booleanArg({default: false, nullable: false})
			},
			// @ts-ignore
			resolve: async (_parent, {email, password, rememberMe}, ctx) => {
				const auth = new Auth()
				// Set params info
				auth.ctx = ctx
				auth.password = password
				auth.rememberMe = rememberMe
				auth.data = {
					email
				}
				// Set database user to the class
				await auth.setPrismaUser()
				// Compare given password with database password
				await auth.comparePassword()
				// Set jwt token to the class
				auth.signToken("signin_", {
					userId: auth.user?.id,
					type: "signin"
				}, {
					audience: "access_token",
					issuer: "cloudlivery",
					jwtid: "1",
					subject: "user",
					expiresIn: auth.rememberMe ? `${process.env.REDIS_BIG_TTL}s` : `${process.env.REDIS_TTL}s`
				})

				return {
					token: auth.token,
					user: auth.user
				}
			}
		})
		t.field("googleSignin", {
			type: "AuthPayload",
			args: {
				google_id: stringArg(),
				lastname: stringArg(),
				firstname: stringArg(),
				email: stringArg({nullable: false}),
				rememberMe: booleanArg({default: false, nullable: false})
			},
			//@ts-ignore
			resolve: async (_parent, {google_id, lastname, firstname, email, rememberMe}, ctx) => {
				const auth = new Auth()
				// Set params info
				auth.ctx = ctx
				auth.rememberMe = rememberMe
				auth.data = {
					email
				}
				// Get the user
				auth.user = await auth.getPrismaUser()
				// If user exist for the mail
				if (auth.user) {
					// If the user haven't a google_id
					if (!auth.user.google_id) {
						// Update the user and set the google_id
						auth.id = auth.user.id
						auth.user.google_id = google_id
						auth.user = await auth.updateUser()

						if (!auth.user) {
							CustomError.updateUser()
						}
					}
				} else { // If not
					// Create the user
					auth.user = {
						google_id,
						lastname,
						firstname,
						email
					}
					auth.user = await auth.createUser()

					if (!auth.user) {
						CustomError.createUser()
					}
				}

				// Set jwt token to the class
				auth.signToken("signin_", {
					userId: auth.user?.id,
					type: "signin"
				}, {
					audience: "access_token",
					issuer: "cloudlivery",
					jwtid: "1",
					subject: "user",
					expiresIn: auth.rememberMe ? `${process.env.REDIS_BIG_TTL}s` : `${process.env.REDIS_TTL}s`
				})

				return {
					token: auth.token,
					user: auth.user
				}
			}
		})
		t.field("signout", {
			type: "Default",
			resolve: async (_parent, {}, ctx) => {
				const auth = new Auth()

				// Set params info
				auth.ctx = ctx
				auth.id = auth.extractIdFromJwt()
				// Delete jwt token from the class
				await auth.deleteToken("signin_", "Erreur lors de la déconnexion.")

				return {
					message: "Déconnecté avec succès"
				}
			}
		})
		t.field("resetPassword", {
			type: "Default",
			args: {
				email: stringArg({nullable: false})
			},
			// @ts-ignore
			resolve: async (_parent, {email}, ctx) => {
				const auth = new Auth()

				// Set params info
				auth.ctx = ctx
				auth.data = {email}

				// If user exist
				auth.user = await auth.getPrismaUser()
				if (auth.user) {
					const url = auth.generateResetPasswordUrl("reset_password_")
					const mail = new Mail()
					mail.to = email
					mail.subject = "Création d'un compte sur cloudlivery.fr"
					mail.createTransport()
					mail.send("signup.ejs")
				}

				return {
					message: "Si votre email est connue, afin de réinitialiser votre mot de passe, un e-mail va vous être envoyé. Cela peut prendre quelques minutes."
				}
			}
		})
		t.field("resetPasswordSave", {
			type: "Default",
			args: {
				token: stringArg({nullable: false}),
				password: stringArg({nullable: false})
			},
			// @ts-ignore
			resolve: async (_parent, {token, password}, ctx) => {
				const auth = new Auth()

				// Set params info
				auth.ctx = ctx
				auth.token = token
				auth.id = auth.extractIdFromJwt()
				auth.data = {id: auth.extractIdFromJwt()}
				auth.user = await auth.getPrismaUser()

				if (!await auth.existInRedis("reset_password_")) {
					CustomError.invalidToken()
				}

				if (auth.user) {
					auth.user.password = await hash(password, 10)
					await auth.updateUser()
					await auth.deleteToken("reset_password_", "Erreur lors de la modification du mot de passe.")
				}

				return {
					message: "Modification du mot de passe effectué avec succès."
				}
			}
		})
		t.field("setupDatas", {
			type: "Default",
			resolve: async (_parent, {}, ctx) => {
				const scraping = new Scraping()
				scraping.ctx = ctx
				//await scraping.createPrismaProvider()
				//await scraping.createPrismaMarques()
				//await scraping.createPrismaFormats()
				//await scraping.createPrismaLabelsQualites()
				//await scraping.createPrismaPreferencesAlimentaires()
				//await scraping.createPrismaPromotions()
				//await scraping.createPrismaSubstancesControversees()
				//await scraping.createPrismaRayons()

				let json = {
					"type": "product",
					"id": "product-3760214348141",
					"attributes": {
						"ean": "3760214348141",
						"cdbase": "4820843",
						"title": "Œufs gros OEUF CHAMPAG.ARDENNE",
						"brand": "OEUF CHAMPAG.ARDENNE",
						"slug": "oeufs-gros-oeuf-champag-ardenne",
						"availability": {
							"indispensable": false,
							"purchasable": true,
							"stopped": false,
							"checkable": false,
							"currentStoreOffer": null
						},
						"price": {
							"price": 3.3,
							"unitOfMeasure": "Pièce",
							"perUnitLabel": "0.28 € / Pièce",
							"taxMessage": "",
							"perUnit": 0.28
						},
						"ordering": {"min": 1, "step": 1, "max": 20},
						"offerServiceId": "0261-150-6",
						"uri": "cremerie/oeufs",
						"categories": [{
							"id": "1967",
							"code": "R05",
							"slug": "cremerie",
							"label": "Crémerie",
							"uri": "cremerie",
							"type": "RAYON",
							"level": 1,
							"sellerId": null
						}, {
							"id": "1976",
							"code": "R05F05",
							"slug": "oeufs",
							"label": "Oeufs",
							"uri": "cremerie/oeufs",
							"type": "RAYON",
							"level": 2,
							"sellerId": null
						}],
						"topCategoryName": "Crémerie",
						"images": [{
							"largest": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"1500x1500": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"540x540": "/media/540x540/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"380x380": "/media/380x380/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"340x340": "/media/340x340/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"340x240": "/media/340x240/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"280x280": "/media/280x280/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"195x195": "/media/195x195/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"150x150": "/media/150x150/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1",
							"43x43": "/media/43x43/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1"
						}, {
							"largest": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"1500x1500": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"540x540": "/media/540x540/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"380x380": "/media/380x380/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"340x340": "/media/340x340/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"340x240": "/media/340x240/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"280x280": "/media/280x280/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"195x195": "/media/195x195/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"150x150": "/media/150x150/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1",
							"43x43": "/media/43x43/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1"
						}, {
							"largest": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"1500x1500": "/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"540x540": "/media/540x540/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"380x380": "/media/380x380/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"340x340": "/media/340x340/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"340x240": "/media/340x240/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"280x280": "/media/280x280/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"195x195": "/media/195x195/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"150x150": "/media/150x150/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1",
							"43x43": "/media/43x43/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1"
						}],
						"promotion": null,
						"isDonation": false,
						"highlightLabel": null,
						"seller": null,
						"sellerId": null,
						"marketplace": null,
						"flags": ["flag.common.poulepleinair"],
						"clubs": [],
						"packaging": "la boite de 12",
						"origin": "",
						"format": ""
					},
					"relationships": {"substitution": null},
					"meta": {
						"recommendation": null,
						"cta": "buy",
						"features": {"shoppingList": true, "deletable": false, "swap": false, "feedback": false}
					},
					"links": {"self": "/p/oeufs-gros-oeuf-champag-ardenne-3760214348141"}
				}

				//console.log(json)
				console.log(json.attributes.title.split(" "))
				
				let marque: string = ""
				
				for(let title of json.attributes.title.split(" ")){
					if(title === title.toUpperCase()) {
						marque += title + " "
					}
				}

				let produit_images: Array<string> = []

				for(let images of json.attributes.images){
					produit_images = [...produit_images, {

					}]
				}

				let product = {
					label: json.attributes.title,
					ean: json.attributes.ean,
					brand: json.attributes.brand,
					slug: json.attributes.slug,
					uri: json.attributes.uri,
					packaging: json.attributes.packaging,
					origin: json.attributes.origin,
					format: json.attributes.format,
					price: json.attributes.price.price,
					unit_of_measure: json.attributes.price.unitOfMeasure,
					per_unit_label: json.attributes.price.perUnitLabel,
					tax_message: json.attributes.price.taxMessage,
					per_unit: json.attributes.price.perUnit,
					provider: {
						connect: {
							label: "CARREFOUR"
						}
					},
					marque: {
						connect: {
							label: marque.trim()
						}
					},
					produit_images: {
						create: produit_images
					},
				}

				console.log(product)
				
				/*await ctx.prisma.produit.create({
					data: {
						label: "Œufs gros OEUF CHAMPAG.ARDENNE",
						ean: "3760214348141",
						brand: "OEUF CHAMPAG.ARDENNE",
						slug: "oeufs-gros-oeuf-champag-ardenne",
						uri: "cremerie/oeufs",
						packaging: "la boite de 12",
						origin: "",
						format: "",
						price: 3.3,
						unit_of_measure: "Pièce",
						per_unit_label: "0.28 € / Pièce",
						tax_message: "",
						per_unit: 0.28,
						provider: {
							connect: {
								label: "CARREFOUR"
							}
						},
						marque: {
							connect: {
								label: "ABATILLES"
							}
						},
						produit_images: {
							create: [
								{
									largest: "https://www.carrefour.fr/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1"
								},
								{
									largest: "https://www.carrefour.fr/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_3.jpg?placeholder=1"
								},
								{
									largest: "https://www.carrefour.fr/media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_7.jpg?placeholder=1"
								}
							]
						},
						produit_labels_qualites: {
							create: [
								{
									labels_qualite:{
										connect: {
											id: 1
										}
									}
								},
								{
									labels_qualite:{
										connect: {
											id: 3
										}
									}
								},
							]
						}
					}
				})*/

				return {
					message: "Ok"
				}
			}
		})
	}
})