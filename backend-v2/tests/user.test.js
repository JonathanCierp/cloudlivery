import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
//import { PrismaClient } from "@prisma/client"
import { getClient } from "./utils/getClient"
import { verify } from "jsonwebtoken"
import { appSecret } from "../src/utils"
import { client, Redis } from "../src/class/redis/Redis"

const clientTest = getClient();
const redis = new Redis(client)

describe("Tests the createUser Mutation", () => {
	/*it("Query me", async () => {
		const me = gql`
			query {
				me {
					message
				}
			}
		`

		const { data } = await clientTest.query({
			query: me
		})
		expect(data.me.message).toBe("Hello world !");
	})*/
	it("Mutation signin check if token in redis, rememberMe = false", async () => {
		const signin = gql`
			mutation {
				signin(email: "a@a.fr", password: "a", rememberMe: false) {
					token
					user {
						id
						google_id
						email
					}
				}
			}
		`

		const { data } = await clientTest.mutate({
			mutation: signin
		})

		expect(data.signin.user.id).toBe(1);
		expect(data.signin.user.email).toBe("a@a.fr");
		expect(await redis.compare(`signin_${data.signin.user.id}`, data.signin.token)).toBeTruthy();
	})
	it("Mutation signin check if token in redis, rememberMe = true", async () => {
		const signin = gql`
			mutation {
				signin(email: "a@a.fr", password: "a", rememberMe: true) {
					token
					user {
						id
						google_id
						email
					}
				}
			}
		`

		const { data } = await clientTest.mutate({
			mutation: signin
		})

		const payload = verify(data.signin.token, appSecret, {
			audience: "access_token",
			issuer: "cloudlivery"
		})

		expect(data.signin.user.id).toBe(1);
		expect(data.signin.user.email).toBe("a@a.fr");
		expect(payload.exp).toBeGreaterThan(604700);
		expect(await redis.compare(`signin_${data.signin.user.id}`, data.signin.token)).toBeTruthy();
	})
});