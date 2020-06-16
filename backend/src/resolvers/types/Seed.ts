import { objectType } from "nexus"

export const Seed = objectType({
	name: "Seed",
	definition(t) {
		t.field("users", { type: "User" })
	}
})