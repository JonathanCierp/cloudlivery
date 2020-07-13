import { objectType } from "@nexus/schema"

export const Rayon = objectType({
	name: "Rayon",
	definition(t) {
		t.int("id")
		t.field("provider", { type: "Provider" })
		t.string("label")
		t.string("code")
		t.string("slug")
		t.string("uri")
		t.int("level")
		t.int("resultats")
		t.boolean("scraping")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	},
})