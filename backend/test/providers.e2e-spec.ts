import { Test, TestingModule } from "@nestjs/testing"
import { GraphQLModule } from "@nestjs/graphql"
import * as request from "supertest"
import { ProvidersModule } from "../src/modules/providers/providers.module"
import { ProvidersInterface } from "../src/modules/providers/providers.interface"
import { providers } from "../src/sources"
import SqlConnection from "../src/app.mysql.connection";

describe("ProvidersController (e2e)", () => {
	let app

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ProvidersModule,
				SqlConnection,
				GraphQLModule.forRoot({
					autoSchemaFile: "schema.gql",
				}),
			],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	const FindId: number = 46 // id auchan + 5
	const UpdateId: number = 46 // id auchan + 5
	const DeleteId: number = 46 // id auchan + 5

	const provider: ProvidersInterface = {
		label: "LABEL_TEST_1",
		prefix_url: "PREFIX_URL_TEST_1"
	}

	const providerUpdated: ProvidersInterface = {
		id: UpdateId,
		label: "LABEL_TEST_2",
		prefix_url: "PREFIX_URL_TEST_2"
	}

	const buildArg = (provider) => {
		return JSON.stringify(provider).replace(/\"([^(\")"]+)\":/g, "$1:")
	}

	it("deleteAllProvider", () => {
		const deleteAllProviderMutation = `
		mutation {
			deleteAllProvider {
					id
					label
					prefix_url
					updatedAt
					createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteAllProviderMutation,
			})
			.expect(({body}) => {
				const data: ProvidersInterface[] = body.data.deleteAllProvider

				expect(data.length).toEqual(providers.length)
				providers.forEach((provider, index) => {
					expect(data[index].label).toBe(provider.label)
				})

			})
			.expect(200)
	})

	it("createAllProvider", () => {
		const createAllProviderMutation = `
			mutation {
				createAllProvider {
					id
					label
					prefix_url
					updatedAt
					createdAt
				}
			}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createAllProviderMutation,
			})
			.expect(({body}) => {
				const data: ProvidersInterface[] = body.data.createAllProvider

				expect(data.length).toEqual(providers.length)
				providers.forEach((provider, index) => {
					expect(data[index].label).toBe(provider.label)
				})

			})
			.expect(200)
	})

	it("findAllProvider", () => {
		const findAllProviderQuery = `
		query {
			providers {
				id
				label
				prefix_url
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findAllProviderQuery,
			})
			.expect(({body}) => {
				const data: ProvidersInterface[] = body.data.providers

				expect(data.length).toEqual(providers.length)
				providers.forEach((provider, index) => {
					expect(data[index].label).toBe(provider.label)
				})

			})
			.expect(200)
	})

	it("createProvider", () => {
		const createProviderMutation = `
		mutation {
			createProvider(input: ${buildArg(provider)}) {
				id
				label
				prefix_url
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createProviderMutation,
			})
			.expect(({body}) => {
				const data: ProvidersInterface = body.data.createProvider

				expect(data.label).toEqual("LABEL_TEST_1")
				expect(data.prefix_url).toEqual("PREFIX_URL_TEST_1")
			})
			.expect(200)
	})

	it("updateProvider", () => {
		const updateProviderMutation = `
		mutation {
			updateProvider(input: ${buildArg(providerUpdated)}) {
				id
				label
				prefix_url
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: updateProviderMutation,
			})
			.expect(({body}) => {
				const data: ProvidersInterface = body.data.updateProvider

				expect(data.label).toBe(providerUpdated.label)
				expect(data.prefix_url).toBe(providerUpdated.prefix_url)
			})
			.expect(200)
	})

	it("findProvider", () => {
		const findProviderQuery = `
		query {
			provider(id: ${FindId}) {
				id
				label
				prefix_url
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findProviderQuery,
			})
			.expect(({body}) => {
				const data: ProvidersInterface = body.data.provider

				expect(data.label).toEqual("LABEL_TEST_2")
			})
			.expect(200)
	})

	it("deleteProvider", () => {
		const deleteProviderMutation = `
		mutation {
			deleteProvider(id: ${DeleteId}) {
				id
				label
				prefix_url
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteProviderMutation,
			})
			.expect(({body}) => {
				const data: ProvidersInterface = body.data.deleteProvider

				expect(data.label).toEqual(providerUpdated.label)
			})
			.expect(200)
	})
})