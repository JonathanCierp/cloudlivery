// Classes
import WebAuth from "../auth/Auth"
// Utils
import { rule, shield } from "graphql-shield"
// Types
import { GetGen } from "nexus/dist/typegenTypeHelpers"

const webAuth = new WebAuth()

const rules = {
	isAuthenticatedUser: rule()(async (parent, args, ctx: GetGen<"context">): Promise<boolean> => {
		// Set params info
		webAuth.setId(webAuth.extractIdFromJwt(ctx))
		webAuth.setToken(webAuth.extractTokenFromJwt(ctx))

		// Return true if token exist in redis
		return await webAuth.existInRedis()
	}),
	/*isPostOwner: rule()(async (parent, { id }, context) => {
		const userId = getUserId(context)
		const author = await context.prisma.post
			.findOne({
				where: {
					id: Number(id),
				},
			})
			.author()
		return userId === author.id
	}),*/
}

export const permissions = shield({
	Query: {
		me: rules.isAuthenticatedUser,
		/*filterPosts: rules.isAuthenticatedUser,
		post: rules.isAuthenticatedUser,*/
	},
	Mutation: {
		/*createDraft: rules.isAuthenticatedUser,
		deletePost: rules.isPostOwner,
		publish: rules.isPostOwner,*/
	}
})