import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { mutationType, stringArg, intArg } from "nexus"
import { APP_SECRET } from "../utils"
import WebAuth from "../auth/WebAuth";

const webAuth = new WebAuth()

export const Mutation = mutationType({
	definition(t) {
		t.field("signup", {
			type: "AuthPayload",
			args: {
				lastname: stringArg(),
				firstname: stringArg(),
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			resolve: async (_parent, { lastname, firstname, email, password }, ctx) => {
				const hashedPassword = await hash(password, 10)
				if(email === "") {
					throw new Error("L'email ne peut pas être vide.")
				}
				if(!email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
					throw new Error("L'email est invalide.")
				}
				if(password === "") {
					throw new Error("Le mot de passe ne peut pas être vide.")
				}
				const user = await ctx.prisma.user.create({
					data: {
						lastname,
						firstname,
						email,
						password: hashedPassword,
					}
				})

				return {
					// @ts-ignore
					token: sign({ userId: user.id }, APP_SECRET, {
						expiresIn: process.env.REDIS_TTL_JWT
					}),
					user
				}
			}
		})
		t.field("signin", {
			type: "AuthPayload",
			args: {
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			resolve: async (_parent, { email, password }, ctx) => {
				// Set params info
				webAuth.setEmail(email)
				webAuth.setPassword(password)
				// Set database user to the class
				await webAuth.setPrismaUser(ctx)
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
		t.field("signout", {
			type: "Signout",
			resolve: async (_parent, {}, ctx) => {
				// Set params info
				webAuth.setId(webAuth.extractIdFromJwt(ctx))
				// Delete jwt token from the class
				await webAuth.deleteToken()

				return {
					message: "Déconnecté avec succès"
				}
			}
		});
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