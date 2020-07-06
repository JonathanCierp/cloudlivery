import { objectType } from "nexus"

export const Carrefour = objectType({
	name: "Carrefour",
	definition(t) {
		t.string("id")
		t.string("type")
		t.field("attributes", { type: "CarrefourAttributes" })
		//.field("relationships", { type: "CarrefourRelationships" })
		//.field("meta", { type: "CarrefourMeta" })
		//.field("links", { type: "CarrefourLinks" })
	},
})