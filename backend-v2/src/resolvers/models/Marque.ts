import { objectType } from "@nexus/schema"

export const Marque = objectType({
	name: "Marque",
	definition(t) {
		t.int("id")
		t.string("label")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	}
})