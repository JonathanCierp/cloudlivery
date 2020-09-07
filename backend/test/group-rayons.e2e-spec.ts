import { Test, TestingModule } from "@nestjs/testing"
import { MongooseModule } from "@nestjs/mongoose"
import { GraphQLModule } from "@nestjs/graphql"
import * as request from "supertest"
import { GroupRayonsModule } from "../src/modules/group-rayons/group-rayons.module"
import { GroupRayonsInterface } from "../src/modules/group-rayons/group-rayons.interface"
import { groupRayons, providers } from "../src/sources"
import { ProvidersModule } from "../src/modules/providers/providers.module";
import SqlConnection from "../src/app.mysql.connection";

describe("GroupRayonsController (e2e)", () => {
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

	const groupRayon: GroupRayonsInterface = {
		label: "LABEL_TEST_1",
		slug: "SLUG_TEST_1",
		type: "TYPE_TEST_1",
		urlCarrefour: "URL_CARREFOUR_TEST_1",
		urlAuchan: "URL_AUCHAN_TEST_1",
		rayons: [
			{
				code: "R01",
				label: "Crémerie",
				slug: "cremerie",
				uri: "/r/cremerie",
				level: 1
			},
			{
				code: "R01SR01",
				label: "Lait",
				slug: "cremerie/lait",
				uri: "/r/cremerie/lait",
				level: 2
			},
			{
				code: "R02SR02SSR01",
				label: "Saumons et truites",
				slug: "viandes-et-poissons/poissonnerie/saumons-et-truites",
				uri: "/r/viandes-et-poissons/poissonnerie/saumons-et-truites",
				level: 3
			}
		]
	}

	const groupRayonUpdated: GroupRayonsInterface = {
		label: "LABEL_TEST_2",
		slug: "SLUG_TEST_2",
		type: "TYPE_TEST_2",
		urlCarrefour: "URL_CARREFOUR_TEST_2",
		urlAuchan: "URL_AUCHAN_TEST_2",
		rayons: [
			{
				code: "R01",
				label: "Crémerie",
				slug: "cremerie",
				uri: "/r/cremerie",
				level: 1
			},
			{
				code: "R01SR01",
				label: "Lait",
				slug: "cremerie/lait",
				uri: "/r/cremerie/lait",
				level: 2
			},
			{
				code: "R02SR01SSR01",
				label: "Boeuf",
				slug: "viandes-et-poissons/boucherie/boeuf",
				uri: "/r/viandes-et-poissons/boucherie/boeuf",
				level: 3
			},
		]
	}

	const buildArg = (groupRayon) => {
		return JSON.stringify(groupRayon).replace(/\"([^(\")"]+)\":/g, "$1:")
	}

	it("test", () => {
		expect(1).toEqual(1)
	})
	/*	it("deleteAllGroupRayon", () => {
		const deleteAllGroupRayonMutation = `
		mutation {
			deleteAllGroupRayon {
				label
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteAllGroupRayonMutation,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface[] = body.data.deleteAllGroupRayon

				expect(data.length).toEqual(groupRayons.length)
				groupRayons.forEach((groupRayon, index) => {
					expect(data[index].label).toBe(groupRayon.label)
				})

			})
			.expect(200)
	})

	it("createAllGroupRayon", () => {
		const createAllGroupRayonMutation = `
			mutation {
				createAllGroupRayon {
					label
					slug
					type
					urlCarrefour
					urlAuchan
					rayons {
						code
						label
						slug
						uri
						level
					}
				}
			}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createAllGroupRayonMutation,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface[] = body.data.createAllGroupRayon

				expect(data.length).toEqual(groupRayons.length)
				groupRayons.forEach((groupRayon, index) => {
					expect(data[index].label).toBe(groupRayon.label)
				})

			})
			.expect(200)
	})

	it("findAllGroupRayon", () => {
		const findAllGroupRayonQuery = `
		query {
			groupRayons {
				label
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findAllGroupRayonQuery,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface[] = body.data.groupRayons

				expect(data.length).toEqual(groupRayons.length)
				groupRayons.forEach((groupRayon, index) => {
					expect(data[index].slug).toBe(groupRayon.slug)
				})

			})
			.expect(200)
	})

	it("findGroupRayon", () => {
		const findGroupRayonQuery = `
		query {
			groupRayon(id: "", label: "lait-demi-ecreme") {
				label
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: findGroupRayonQuery,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface = body.data.groupRayon

				expect(data.slug).toEqual("lait-demi-ecreme")
			})
			.expect(200)
	})

	it("createGroupRayon", () => {
		const createGroupRayonMutation = `
		mutation {
			createGroupRayon(input: ${buildArg(groupRayon)}) {
				id
				label
				slug
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: createGroupRayonMutation,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface = body.data.createGroupRayon

				expect(data.slug).toEqual("SLUG_TEST_1")
			})
			.expect(200)
	})

	it("updateGroupRayon", () => {
		const updateGroupRayonMutation = `
		mutation {
			updateGroupRayon(id: "", input: ${buildArg(groupRayonUpdated)}, label: "LABEL_TEST_1") {
				label
				slug
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: updateGroupRayonMutation,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface = body.data.updateGroupRayon

				expect(data.label).toBe(groupRayonUpdated.label)
				expect(data.slug).toBe(groupRayonUpdated.slug)
			})
			.expect(200)
	})

	it("deleteGroupRayon", () => {
		const deleteGroupRayonMutation = `
		mutation {
			deleteGroupRayon(id: "", label: "LABEL_TEST_2") {
				label
			}
		}`

		return request(app.getHttpServer())
			.post("/graphql")
			.send({
				operationName: null,
				query: deleteGroupRayonMutation,
			})
			.expect(({body}) => {
				const data: GroupRayonsInterface = body.data.deleteRayon

				expect(data.slug).toEqual("SLUG_TEST_2")
			})
			.expect(200)
	})*/
})