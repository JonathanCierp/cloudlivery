import { objectType } from "@nexus/schema"

export const User = objectType({
	name: "User",
	definition(t) {
		t.int("id")
		t.string("google_id", { nullable: true })
		t.string("lastname")
		t.string("firstname")
		t.string("email")
		t.string("civilite")
		// @ts-ignore
		t.datetime("updatedAt")
		// @ts-ignore
		t.datetime("createdAt")
	}
})