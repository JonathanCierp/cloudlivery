// Classes
import Auth from "../class/auth/Auth"
import CustomError from "../class/error/CustomError";
import Mail from "../class/mail/Mail";
// Utils
import { mutationType, stringArg, booleanArg } from "@nexus/schema"
import { hash } from "bcryptjs";

export const Mutation = mutationType({
	definition(t) {
		t.field("signin", {
			// @ts-ignore
			type: "AuthPayload",
			args: {
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false }),
				rememberMe: booleanArg({ default: false })
			},
			resolve: async (_parent, { email, password, rememberMe }, ctx) => {
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
			// @ts-ignore
			type: "AuthPayload",
			args: {
				google_id: stringArg(),
				lastname: stringArg(),
				firstname: stringArg(),
				email: stringArg({ nullable: false }),
				rememberMe: booleanArg({ default: false })
			},
			//@ts-ignore
			resolve: async (_parent, { google_id, lastname, firstname, email, rememberMe }, ctx) => {
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
				if(auth.user) {
					// If the user haven't a google_id
					if(!auth.user.google_id) {
						// Update the user and set the google_id
						auth.id = auth.user.id
						auth.user.google_id = google_id
						auth.user = await auth.updateUser()

						if(!auth.user) {
							CustomError.updateUser()
						}
					}
				}else{ // If not
					// Create the user
					auth.user = {
						google_id,
						lastname,
						firstname,
						email
					}
					auth.user = await auth.createUser()

					if(!auth.user) {
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
				await auth.deleteToken()

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
				const auth = new Auth()
				
				// Set params info
				auth.ctx = ctx
				auth.data = { email }
				
				// If user exist
				auth.user = await auth.getPrismaUser()
				if(auth.user) {
					const url = auth.generateResetPasswordUrl("reset_password_")
					const mail = new Mail()
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
				token: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			// @ts-ignore
			resolve: async (_parent, { token, password }, ctx) => {
				const auth = new Auth()

				// Set params info
				auth.ctx = ctx
				auth.token = token
				auth.id = auth.extractIdFromJwt()
				auth.data = { id: auth.extractIdFromJwt() }
				auth.user = await auth.getPrismaUser()

				if(auth.user) {
					auth.user.password = await hash(password, 10)
					await auth.updateUser()
					await auth.deleteToken("reset_password_")
				}

				return {
					message: "Modification du mot de passe effectué avec succès."
				}
			}
		})
	}
})