import { scalarType, asNexusMethod } from "@nexus/schema"
import { GraphQLDateTime } from "graphql-iso-date";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, "datetime");