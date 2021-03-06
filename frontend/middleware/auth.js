import GqlMe from "~/utils/apollo/query/me"
import jwt from "jsonwebtoken"

export default async function ({ app, store, env }) {
	const apollo = app.apolloProvider.clients.defaultClient
	const token = app.$apolloHelpers.getToken()

	if(token) {
		try {
			jwt.verify(token, env.APP_SECRET, { audience: "access_token", issuer: "cloudlivery" })

			try {
				const res = await apollo.query({
					query: GqlMe,
					fetchPolicy: "no-cache"
				})
				store.commit("SET_AUTH", res.data.me.item)
			}catch (e) {
				console.log(e)
				app.$cookies.remove("apollo-token")
				store.commit("SET_AUTH", {})
			}
		} catch (e) {
			console.log(e)
			app.$cookies.remove("apollo-token")
			store.commit("SET_AUTH", {})
		}
	}
}