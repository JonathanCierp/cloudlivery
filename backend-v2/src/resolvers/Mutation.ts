// Classes
import Auth from "../class/auth/Auth"
// Utils
import { mutationType, stringArg, booleanArg } from "@nexus/schema"

export const Mutation = mutationType({
	definition(t) {
		t.field("signin", {
			type: "AuthPayload",
			args: {
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false }),
				rememberMe: booleanArg({ default: false })
			},
			resolve: async (_parent, { email, password, rememberMe }, ctx) => {
				/*
				// Compare given password with database password
				await webAuth.comparePassword()
				// Set jwt token to the class
				webAuth.signToken()

				return {
					token: webAuth.getToken(),
					user: webAuth.getUser()
				}*/
				
				const auth = new Auth()
				// Set params info
				auth.setCtx(ctx)
				auth.setPassword(password)
				auth.setRememberMe(rememberMe)
				auth.setData({
					email
				})
				// Set database user to the class
				await auth.setPrismaUser()
				// Compare given password with database password
				await auth.comparePassword()
				// Set jwt token to the class
				auth.signToken("signin_", {
					userId: auth.getUser()?.id,
					type: "signin"
				}, {
					audience: "access_token",
					issuer: "cloudlivery",
					jwtid: "1",
					subject: "user",
					expiresIn: auth.getRememberMe() ? `${process.env.REDIS_BIG_TTL}s` : `${process.env.REDIS_TTL}s`
				})
				
				return {
					token: "aze",
					user: auth.getUser()
				}
			}
		})
	}
})