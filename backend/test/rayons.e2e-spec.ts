import { Test, TestingModule } from "@nestjs/testing"
import { MongooseModule } from "@nestjs/mongoose"
import { GraphQLModule } from "@nestjs/graphql"
import * as request from "supertest"
import { RayonsModule } from "../src/modules/rayons/rayons.module"
import { RayonsInterface } from "../src/modules/rayons/rayons.interface"
import { rayons } from "../src/sources"
import { ProvidersModule } from "../src/modules/providers/providers.module";
import SqlConnection from "../src/app.mysql.connection";

describe("RayonsController (e2e)", () => {
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

	const rayon: RayonsInterface = {
		code: "CODE_TEST_3",
		label: "LABEL_TEST_3",
		slug: "SLUG_TEST_3",
		uri: "URI_TEST_3",
		level: 1
	}

	const rayonUpdated: RayonsInterface = {
		code: "CODE_TEST_4",
		label: "LABEL_TEST_4",
		slug: "SLUG_TEST_4",
		uri: "URI_TEST_4",
		level: 1
	}

	const buildArg = (rayon) => {
		return JSON.stringify(rayon).replace(/\"([^(\")"]+)\":/g, "$1:")
	}

	it("testa", () => {
		expect(1).toEqual(1)
	})
/*
	it("deleteAllRayon", () => {
		const deleteAllRayonMutation = `
		mutation {
			deleteAllRayon {
				label
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

				expect(data.length).toEqual(rayons.length)
				rayons.forEach((rayon, index) => {
					expect(data[index].label).toBe(rayon.label)
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

				expect(data.length).toEqual(rayons.length)
				rayons.forEach((rayon, index) => {
					expect(data[index].label).toBe(rayon.label)
				})

			})
			.expect(200)
	})

	it("findAllRayon", () => {
		const findAllRayonQuery = `
		query {
			rayons {
				label
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

				expect(data.length).toEqual(rayons.length)
				rayons.forEach((rayon, index) => {
					expect(data[index].label).toBe(rayon.label)
				})

			})
			.expect(200)
	})

	it("findRayon", () => {
		const findRayonQuery = `
		query {
			rayon(id: "", label: "LABEL_TEST_0") {
				label
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

				expect(data.label).toEqual("LABEL_TEST_0")
			})
			.expect(200)
	})

	it("createRayon", () => {
		const createRayonMutation = `
		mutation {
			createRayon(input: ${buildArg(rayon)}) {
				id
				label
				slug
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

				expect(data.label).toEqual("LABEL_TEST_3")
			})
			.expect(200)
	})

	it("updateRayon", () => {
		const updateRayonMutation = `
		mutation {
			updateRayon(id: "", input: ${buildArg(rayonUpdated)}, label: "LABEL_TEST_3") {
				label
				slug
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

	it("deleteRayon", () => {
		const deleteRayonMutation = `
		mutation {
			deleteRayon(id: "", label: "LABEL_TEST_4") {
				label
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

				expect(data.label).toEqual("LABEL_TEST_4")
			})
			.expect(200)
	})*/
})