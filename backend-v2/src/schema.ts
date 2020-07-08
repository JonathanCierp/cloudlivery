//import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema"
import { makeSchema } from "@nexus/schema"
import * as resolvers from "./resolvers"

export default makeSchema({
	types: resolvers,
	//plugins: [nexusSchemaPrisma()],
	outputs: {
		schema: __dirname + "/prisma/schema.graphql",
		typegen: __dirname + "/prisma/generated/nexus.ts"
	},
	typegenAutoConfig: {
		sources: [
			{
				source: "@prisma/client",
				alias: "client"
			},
			{
				source: require.resolve("./prisma/context"),
				alias: "Context"
			},
		],
		contextType: "Context.Context",
	}
})