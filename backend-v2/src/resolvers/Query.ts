// Class
import Auth from "../class/auth/Auth"
// Utils
import { queryType } from "@nexus/schema"

export const Query = queryType({
	definition(t) {
		t.field("me", {
			type: "Default",
			nullable: true,
			resolve: async (parent, { }, ctx) => {
				const auth = new Auth()
				auth.setCtx(ctx)
				auth.setData({
					email: "azerty24041997@gmail.com"
				})

				return {
					message: "Hello world !"
				}
			}
		})
	}
})