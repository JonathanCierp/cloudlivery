import { objectType } from "@nexus/schema"

export const Default = objectType({
	name: "Default",
	definition(t) {
		t.string("message")
	},
})