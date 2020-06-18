import { objectType } from "nexus"

export const Logout = objectType({
	name: "Logout",
	definition(t) {
		t.int("statut")
	},
})