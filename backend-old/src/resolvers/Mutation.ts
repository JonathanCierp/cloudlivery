// Classes
import WebAuth from "../class/auth/WebAuth"
import GoogleAuth from "../class/auth/GoogleAuth"
import Mail from "../class/mail/Mail"
import Scraping from "../class/scraping/Scraping"
// Utils
import { APP_SECRET } from "../utils"
// Packages
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { mutationType, stringArg, intArg, arg, booleanArg } from "nexus"
// Types
import { User, GoogleUserAuth } from "../types/auth"

export const Mutation = mutationType({
	definition(t) {
		t.field("signup", {
			type: "Default",
			args: {
				civilite: stringArg({ nullable: false }),
				firstname: stringArg({ nullable: false }),
				lastname: stringArg({ nullable: false }),
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			resolve: async (_parent, { civilite, firstname, lastname, email, password }, ctx) => {
				const webAuth = new WebAuth()
				webAuth.setCtx(ctx)
				webAuth.setPassword(password)
				await webAuth.hashPassword()

				webAuth.setData({
					email
				})
				if(await webAuth.getPrismaUser()) {
					throw new Error("Un utilisateur existe déjà pour ce mail.")
				}
				if(email === "") {
					throw new Error("L'email ne peut pas être vide.")
				}
				if(!email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
					throw new Error("L'email est invalide.")
				}
				if(password === "") {
					throw new Error("Le mot de passe ne peut pas être vide.")
				}

				webAuth.setData({
					civilite,
					lastname,
					firstname,
					email,
					password: webAuth.getHashedPassword(),
				})
				await webAuth.createUser()

				return {
					message: ""
				}
			}
		})
		t.field("seedUser", {
			type: "Seed",
			args: {
				i: intArg({ default: 1 })
			},
			// @ts-ignore
			resolve: async (_parent, { i }, ctx) => {
				let users: object[] = []

				// @ts-ignore
				for (let offset = 0; offset < i; i++) {
					const randomString = Math.random().toString(36).substring(7)
					const lastname = randomString
					const firstname = randomString
					const email = `${randomString}@prisma.io`
					const password = await hash(randomString, 10)

					users = [...users, await ctx.prisma.user.create({
						data: {
							lastname,
							firstname,
							email,
							password
						}
					})]
				}

				return {
					users
				}
			}
		})
		t.field("signin", {
			type: "AuthPayload",
			args: {
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false }),
				rememberMe: booleanArg({ default: false })
			},
			resolve: async (_parent, { email, password, rememberMe }, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setEmail(email)
				webAuth.setPassword(password)
				//@ts-ignore
				webAuth.setRememberMe(rememberMe)
				webAuth.setCtx(ctx)
				webAuth.setData({
					email
				})
				// Set database user to the class
				await webAuth.setPrismaUser()
				// Compare given password with database password
				await webAuth.comparePassword()
				// Set jwt token to the class
				webAuth.signToken()

				return {
					token: webAuth.getToken(),
					user: webAuth.getUser()
				}
			}
		})
		t.field("googleSignin", {
			type: "AuthPayload",
			args: {
				google_id: stringArg(),
				lastname: stringArg(),
				firstname: stringArg(),
				email: stringArg({ nullable: false }),
				rememberMe: booleanArg({ default: false })
			},
			//@ts-ignore
			resolve: async (_parent, user: GoogleUserAuth, ctx) => {
				const googleAuth = new GoogleAuth()
				// Set params info
				googleAuth.setRememberMe(user.rememberMe)
				delete user.rememberMe
				googleAuth.setGoogleUser(user)
				googleAuth.setEmail(googleAuth.getGoogleUser().email)
				googleAuth.setCtx(ctx)
				googleAuth.setData({
					email: googleAuth.getEmail()
				})

				const googleUser = await googleAuth.getPrismaUser()

				if(googleUser) {
					googleAuth.setGoogleUser(googleUser)
					if(!googleAuth.getGoogleUser().google_id) {
						// Update user
						googleAuth.setId(googleAuth.getGoogleUser().id)
						googleAuth.setData({
							google_id: user.google_id
						})
						await googleAuth.updateUser()
					}
				}else {
					// Create user
					await googleAuth.createUser()
				}

				googleAuth.setData({
					email: googleAuth.getEmail()
				})

				googleAuth.setUser(await googleAuth.getPrismaUser())

				// Set jwt token to the class
				googleAuth.signToken()
				
				return {
					token: googleAuth.getToken(),
					user: googleAuth.getUser()
				}
			}
		})
		t.field("signout", {
			type: "Signout",
			resolve: async (_parent, {}, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setCtx(ctx)
				webAuth.setId(webAuth.extractIdFromJwt())
				// Delete jwt token from the class
				await webAuth.deleteToken()

				return {
					message: "Déconnecté avec succès"
				}
			}
		})
		t.field("resetPassword", {
			type: "Default",
			args: {
				email: stringArg({ nullable: false })
			},
			// @ts-ignore
			resolve: async (_parent, { email }, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setEmail(email)
				webAuth.setCtx(ctx)
				webAuth.setData({
					email
				})
				webAuth.setUser(await webAuth.getPrismaUser())

				if(webAuth.getUser()) {
					console.log(webAuth.generateResetPasswordUrl("reset_password_"))
					/*const mail = new Mail()
					mail.createTransport()
					mail.send("signup.ejs")*/
				}
				
				return {
					message: "Si votre email est connue, afin de réinitialiser votre mot de passe, un e-mail va vous être envoyé. Cela peut prendre quelques minutes."
				}
			}
		})
		t.field("resetPasswordSave", {
			type: "Default",
			args: {
				token: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			// @ts-ignore
			resolve: async (_parent, { token, password }, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setCtx(ctx)
				webAuth.setToken(token)
				webAuth.setId(webAuth.extractIdFromJwt())
				webAuth.setData({
					password: await hash(password, 10)
				})

				if(webAuth.getId()) {
					await webAuth.updateUser()
					await webAuth.deleteToken("reset_password_")
				}

				return {
					message: "Modification du mot de passe effectué avec succès."
				}
			}
		})
		t.field("setupDatas", {
			type: "Default",
			resolve: async (_parent, { }, ctx) => {
				const scraping = new Scraping()
				scraping.setCtx(ctx)
				await scraping.createPrismaProvider()
				await scraping.createPrismaMarques()
				//await scraping.createPrismaFormats()
				//await scraping.getPrismaLabelsQualite()
				//await scraping.getPrismaPreferencesAlimentaires()
				//await scraping.getPrismaPromotion()
				//await scraping.getPrismaSubstancesControversee()

				return {
					message: "Ok"
				}
			}
		})
		/*t.field("createDraft", {
			type: "Post",
			args: {
				title: stringArg({ nullable: false }),
				content: stringArg(),
			},
			resolve: (parent, { title, content }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.post.create({
					data: {
						title,
						content,
						published: false,
						author: { connect: { id: Number(userId) } }
					}
				})
			}
		})
		t.field("deletePost", {
			type: "Post",
			nullable: true,
			args: { id: intArg({ nullable: false }) },
			resolve: (parent, { id }, ctx) => {
				return ctx.prisma.post.delete({
					where: {
						id
					}
				})
			}
		})
		t.field("publish", {
			type: "Post",
			nullable: true,
			args: { id: intArg() },
			resolve: (parent, { id }, ctx) => {
				return ctx.prisma.post.update({
					where: { id },
					data: { published: true }
				})
			}
		})*/
	}
})