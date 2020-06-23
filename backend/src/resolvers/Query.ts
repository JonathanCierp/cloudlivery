// Classes
import WebAuth from "../auth/WebAuth"
// Others
import { intArg, queryType, stringArg } from "nexus"
import { getUserId } from "../utils"

export const Query = queryType({
	definition(t) {
		t.field("me", {
			type: "User",
			nullable: true,
			args: {
				provider: stringArg({ nullable: false })
			},
			resolve: (parent, { provider }, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setCtx(ctx)
				webAuth.extractIdFromJwt()
				const userId = getUserId(ctx)
				return ctx.prisma.user.findOne({
					where: {
						id: Number(userId),
					}
				})
			}
		})
		t.field("tokenIsOk", {
			type: "ResetPassword",
			nullable: true,
			args: {
				token: stringArg({ nullable: false })
			},
			resolve: async (parent, { token }, ctx) => {
				const webAuth = new WebAuth()
				// Set params info
				webAuth.setToken(token)
				webAuth.setId(webAuth.extractIdFromJwt())

				return {
					valid: webAuth.verifyToken() && await webAuth.existInRedis("reset_password_")
				}
			}
		})
		/*t.list.field("feed", {
			type: "Post",
			resolve: (parent, args, ctx) => {
				return ctx.prisma.post.findMany({
					where: { published: true }
				})
			}
		})
		t.list.field("filterPosts", {
			type: "Post",
			args: {
				searchString: stringArg({ nullable: true }),
			},
			resolve: (parent, { searchString }, ctx) => {
				return ctx.prisma.post.findMany({
					where: {
						OR: [
							{
								title: {
									contains: searchString,
								}
							},
							{
								content: {
									contains: searchString,
								}
							}
						]
					}
				})
			}
		})
		t.field("post", {
			type: "Post",
			nullable: true,
			args: { id: intArg() },
			resolve: (parent, { id }, ctx) => {
				return ctx.prisma.post.findOne({
					where: {
						id: Number(id),
					}
				})
			}
		})*/
	}
})