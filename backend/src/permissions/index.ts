import {rule, shield} from "graphql-shield"
import {getUserId} from "../utils"
import {Redis, client} from "../redis"

const redis = new Redis(client)

const rules = {

	isAuthenticatedUser: rule()(async (parent, args, context) => {
		const userId = getUserId(context)
		let jwt = context.request.get("Authorization").split(" ")[1]
		
		const res = await redis.compare(`login_${userId}`, jwt)

		if(res === "not equals") {
			return new Error("Erreur, vous n'êtes pas connecté'.")
		}

		if(!Boolean(userId) || res === "not exist") {
			return new Error("Erreur, vous n'avez pas accès à cette ressource.")
		}
		
		return Boolean(userId) && res
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
	},
})