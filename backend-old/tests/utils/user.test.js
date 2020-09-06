import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
import { client } from "../client"

describe("Tests the createUser Mutation", () => {
	it("Should not connect, incorrect password", async () => {
		const signinUser = gql`
            mutation {
              signin(email: "a@a.fr", password: "a@a.fr", rememberMe: true) {
								token
								user {
									id
								}
							}
            }
		`
		await expect(client.mutate({
			mutation: signinUser
		})).rejects.toThrowError("Incorrect password");
	})
})