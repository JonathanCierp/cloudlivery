import { PrismaClient } from "@prisma/client"
import { ContextParameters } from "graphql-yoga/dist/types"

const prisma = new PrismaClient()

export interface Context {
	prisma: PrismaClient,
	request: any
}

export function context(request: ContextParameters): Context {
	return {
		...request,
		prisma
	}
}