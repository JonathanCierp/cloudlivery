import { objectType } from "@nexus/schema"

export const Provider = objectType({
	name: "Provider",
	definition(t) {
		t.int("id")
		t.string("label")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	}
})