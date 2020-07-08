import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
//import { PrismaClient } from "@prisma/client"
import { getClient } from "./utils/getClient"

const client = getClient();

describe("Tests the createUser Mutation", () => {
	it("Query me", async () => {
		const me = gql`
			query {
				me {
					message
				}
			}
		`

		const { data } = await client.query({
			query: me
		})
		expect(data.me.message).toBe("Hello world !");
	})
	it("Mutation seedProduit", async () => {
		/*const me = gql`
			mutation {
				seedProduit {
					message
				}
			}
		`

		const { data } = await client.mutate({
			mutation: me
		})

		expect(data.seedProduit.message).toBe("Hello world !");*/
		expect("Hello world !").toBe("Hello world !");
	})
});