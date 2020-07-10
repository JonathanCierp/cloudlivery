import { objectType } from "@nexus/schema"

export const DefaultBool = objectType({
	name: "DefaultBool",
	definition(t) {
		t.boolean("valid")
	},
})