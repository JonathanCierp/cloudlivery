// Class
import Auth from "../class/auth/Auth"
import CustomError from "../class/error/CustomError"
// Utils
import { queryType, stringArg } from "@nexus/schema"
// Types
import { User } from "../types/auth";

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
	}
})