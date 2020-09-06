import { objectType } from "nexus"

export const CarrefourAttributesCategories = objectType({
	name: "CarrefourAttributesCategories",
	definition(t) {
		t.string("id")
		t.string("code")
		t.string("slug")
		t.string("label")
		t.string("uri")
		t.string("type")
		t.string("level")
	},
})