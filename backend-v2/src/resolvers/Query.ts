// Class
import Auth from "../class/auth/Auth"
import CustomError from "../class/error/CustomError"
// Utils
import { queryType, stringArg } from "@nexus/schema"
// Types
import { Produit } from "../types/scraping";

export const Query = queryType({
	definition(t) {
		t.field("me", {
			type: "User",
			/*args: {
				provider: stringArg({ nullable: false })
			},*/
			// @ts-ignore
			resolve: async (parent, { /*provider*/ }, ctx) => {
				const auth = new Auth()
				// Set params info
				auth.ctx = ctx
				auth.id = auth.extractIdFromJwt()
				auth.token = auth.extractTokenFromJwt()
				if(!await auth.existInRedis()) {
					CustomError.invalidToken()
				}
				auth.data = { id: auth.id }

				return await auth.getPrismaUser()
			}
		})
		t.field("tokenIsOk", {
			type: "DefaultBool",
			nullable: true,
			args: {
				token: stringArg({ nullable: false })
			},
			resolve: async (parent, { token }, ctx) => {
				const auth = new Auth()
				// Set params info
				auth.token = token
				auth.id = auth.extractIdFromJwt()

				return {
					valid: auth.verifyToken() && await auth.existInRedis("reset_password_")
				}
			}
		})
		t.field("produits", {
			type: "DefaultBool",
			nullable: true,
			resolve: async (parent, { }, ctx) => {
				let produits: Array<object> = await ctx.prisma.produit.findMany({
					select: {
						id: true,
						label: true,
						ean: true,
						slug: true,
						price: true,
						unit_of_measure: true,
						per_unit_label: true,
						per_unit: true,
						provider: {
							select: {
								label: true
							}
						},
						marque: {
							select: {
								label: true
							}
						},
						produit_images: {
							select: {
								largest: true,
								size_1500x1500: true,
								size_540x540: true,
								size_380x380: true,
								size_340x340: true,
								size_340x240: true,
								size_280x280: true,
								size_195x195: true,
								size_150x150: true,
								size_43x43: true
							}
						},
						produit_labels_qualites: {
							select: {
								labels_qualite: {
									select: {
										label: true
									}
								}
							}
						}
					}
				})
				
				console.log(produits[0])

				return {
					valid: true
				}
			}
		})
	}
})