import GqlMe from "~/utils/apollo/query/me"
import jwt from "jsonwebtoken"

export default async function ({ app, store, env }) {
	const apollo = app.apolloProvider.clients.defaultClient
	const token = app.$apolloHelpers.getToken()

	try {
		jwt.verify(token, env.APP_SECRET)

		try {
			const res = await apollo.query({
				query: GqlMe
			})

			store.commit("SET_AUTH", res.data.me)
		}catch (e) {
			store.commit("SET_AUTH", {})
		}
	} catch (e) {
		store.commit("SET_AUTH", {})
	}
}