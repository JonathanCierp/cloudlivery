import {rule, shield} from "graphql-shield"
import {APP_SECRET, getUserId} from "../utils"
import {Redis, client} from "../redis/Redis"
import {verify} from "jsonwebtoken"

const redis = new Redis(client)

const rules = {
	isAuthenticatedUser: rule()(async (parent, args, context) => {
		const userId = getUserId(context)
		const jwt = context.request.get("Authorization").split(" ")[1]

		const nowTimestamp = ((new Date().getTime() / 1000) + (3600 * 2)).toFixed(0);
		const jwtDecoded: any = verify(jwt, APP_SECRET)
		const refreshTokenTime = jwtDecoded.exp + (3600 * 2) - parseInt(nowTimestamp)
		/*const refreshTokenOptions = { verify: { audience: 'myaud', issuer: 'myissuer' }, jwtid: '2' }
		const payload = verify(jwt, APP_SECRET, refreshTokenOptions.verify);
		console.log(jwtDecoded)*/
		/*if(refreshTokenTime < 600) {
			const payload = verify(jwt, APP_SECRET, refreshTokenOptions.verify);
			console.log(payload)
			delete payload.iat;
			delete payload.exp;
			delete payload.nbf;
			delete payload.jti;
		}*/

		const res = await redis.compare(`signin_${userId}`, jwt)

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