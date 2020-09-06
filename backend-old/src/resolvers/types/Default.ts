import { objectType } from "nexus"

export const Default = objectType({
	name: "Default",
	definition(t) {
		t.string("message")
	},
})