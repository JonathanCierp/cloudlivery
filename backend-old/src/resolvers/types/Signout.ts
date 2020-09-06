import { objectType } from "nexus"

export const Signout = objectType({
	name: "Signout",
	definition(t) {
		t.string("message")
	},
})