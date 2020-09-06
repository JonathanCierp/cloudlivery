import { GraphQLServer } from "graphql-yoga"
import schema from "./schema"
import { context } from "./prisma/context"

const server = new GraphQLServer({
	// @ts-ignore
	schema,
	context,
	middlewares: []
});

export default server;