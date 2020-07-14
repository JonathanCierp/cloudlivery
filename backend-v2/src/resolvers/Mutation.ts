// Classes
import Auth from "../class/auth/Auth"
import CustomError from "../class/error/CustomError"
import Mail from "../class/mail/Mail"
import Scraping from "../class/scraping/Scraping"
import ScrapingPuppeteer from "../class/scraping/ScrapingPuppeteer";
// Utils
import {mutationType, stringArg, booleanArg} from "@nexus/schema"
import {hash} from "bcryptjs"
// Types
import { ProduitImage } from "../types/scraping";

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

				let start_time = new Date().getTime();
				await scraping.createPrismaProvider()
				await scraping.createPrismaMarques()
				await scraping.createPrismaFormats()
				await scraping.createPrismaLabelsQualites()
				await scraping.createPrismaPreferencesAlimentaires()
				await scraping.createPrismaPromotions()
				await scraping.createPrismaSubstancesControversees()
				await scraping.createPrismaRayons()
				console.log("Total time : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))

				return {
					message: "Ok"
				}
			}
		})
		t.field("scrapingPuppeteer", {
			type: "Default",
			resolve: async (_parent, { }, ctx) => {
				const scrapingPuppeteer = new ScrapingPuppeteer()
				scrapingPuppeteer.ctx = ctx
				await scrapingPuppeteer.launchBrowser()
				await scrapingPuppeteer.newPage()

				console.log("Start scraping...")
				await scrapingPuppeteer.startScrapingByProvider()
				console.log("End scraping")

				return {
					message: "Modification du mot de passe effectué avec succès."
				}
			}
		})
		t.field("resetData", {
			type: "Default",
			resolve: async (_parent, { }, ctx) => {
				console.log("Delete all produits...")
				await ctx.prisma.produitRayon.deleteMany({
					where: {
						id: {
							gte: 1
						}
					}
				})
				await ctx.prisma.produitImage.deleteMany({
					where: {
						id: {
							gte: 1
						}
					}
				})
				await ctx.prisma.produit.deleteMany({
					where: {
						id: {
							gte: 1
						}
					}
				})
				console.log("End delete all produits")

				return {
					message: "Modification du mot de passe effectué avec succès."
				}
			}
		})
	}
})