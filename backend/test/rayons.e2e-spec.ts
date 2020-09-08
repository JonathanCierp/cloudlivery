import { Test, TestingModule } from "@nestjs/testing"
import { GraphQLModule } from "@nestjs/graphql"
import * as request from "supertest"
import { RayonsModule } from "../src/modules/rayons/rayons.module"
import { RayonsInterface } from "../src/modules/rayons/rayons.interface"
import { rayons } from "../src/sources"
import SqlConnection from "../src/app.mysql.connection";

describe("RayonsController (e2e)", () => {
	let app

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				RayonsModule,
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

	const FindId: number = 51
	const UpdateId: number = 51
	const DeleteId: number = 51

	const rayon: RayonsInterface = {
		code: "CODE_TEST_0",
		label: "LABEL_TEST_0",
		slug: "SLUG_TEST_0",
		uri: "URI_TEST_0",
		level: 1
	}

	const rayonUpdated: RayonsInterface = {
		id: UpdateId,
		code: "CODE_TEST_1",
		label: "LABEL_TEST_1",
		slug: "SLUG_TEST_1",
		uri: "URI_TEST_1",
		level: 1
	}

	const buildArg = (rayon) => {
		return JSON.stringify(rayon).replace(/\"([^(\")"]+)\":/g, "$1:")
	}

	it("deleteAllRayon", () => {
		const deleteAllRayonMutation = `
		mutation {
			deleteAllRayon {
					id
					code
					label
					slug
					uri
					level
					updatedAt
					createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteAllRayonMutation,
			})
			.expect(({body}) => {
				const data: RayonsInterface[] = body.data.deleteAllRayon

				expect(rayons.length).toEqual(data.length)
				rayons.forEach((rayon, index) => {
					expect(rayon.label).toBe(data[index].label)
				})

			})
			.expect(200)
	})

	it("createAllRayon", () => {
		const createAllRayonMutation = `
			mutation {
				createAllRayon {
					id
					code
					label
					slug
					uri
					level
					updatedAt
					createdAt
				}
			}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createAllRayonMutation,
			})
			.expect(({body}) => {
				const data: RayonsInterface[] = body.data.createAllRayon

				expect(rayons.length).toEqual(data.length)
				rayons.forEach((rayon, index) => {
					expect(rayon.label).toBe(data[index].label)
				})

			})
			.expect(200)
	})

	it("findAllRayon", () => {
		const findAllRayonQuery = `
		query {
			rayons {
				id
				code
				label
				slug
				uri
				level
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findAllRayonQuery,
			})
			.expect(({body}) => {
				const data: RayonsInterface[] = body.data.rayons

				expect(rayons.length).toEqual(data.length)
				rayons.forEach((rayon, index) => {
					expect(rayon.label).toBe(data[index].label)
				})

			})
			.expect(200)
	})

	it("createRayon", () => {
		const createRayonMutation = `
		mutation {
			createRayon(input: ${buildArg(rayon)}) {
				id
				code
				label
				slug
				uri
				level
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createRayonMutation,
			})
			.expect(({body}) => {
				const data: RayonsInterface = body.data.createRayon

				expect(data.label).toEqual("LABEL_TEST_0")
			})
			.expect(200)
	})

	it("updateRayon", () => {
		const updateRayonMutation = `
		mutation {
			updateRayon(input: ${buildArg(rayonUpdated)}) {
				id
				code
				label
				slug
				uri
				level
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: updateRayonMutation,
			})
			.expect(({body}) => {
				const data: RayonsInterface = body.data.updateRayon

				expect(data.label).toBe(rayonUpdated.label)
				expect(data.slug).toBe(rayonUpdated.slug)
			})
			.expect(200)
	})

	it("findRayon", () => {
		const findRayonQuery = `
		query {
			rayon(id: ${FindId}) {
				id
				code
				label
				slug
				uri
				level
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findRayonQuery,
			})
			.expect(({body}) => {
				const data: RayonsInterface = body.data.rayon

				expect(data.label).toEqual("LABEL_TEST_1")
				expect(data.slug).toEqual("SLUG_TEST_1")
				expect(data.uri).toEqual("URI_TEST_1")
			})
			.expect(200)
	})

	it("deleteRayon", () => {
		const deleteRayonMutation = `
		mutation {
			deleteRayon(id: ${DeleteId}) {
				id
				code
				label
				slug
				uri
				level
				updatedAt
				createdAt
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteRayonMutation,
			})
			.expect(({body}) => {
				const data: RayonsInterface = body.data.deleteRayon

				expect(data.label).toEqual("LABEL_TEST_1")
				expect(data.slug).toEqual("SLUG_TEST_1")
				expect(data.uri).toEqual("URI_TEST_1")
			})
			.expect(200)
	})
})