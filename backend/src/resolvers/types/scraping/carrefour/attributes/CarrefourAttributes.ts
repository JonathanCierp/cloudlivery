import { objectType } from "nexus"

export const CarrefourAttributes = objectType({
	name: "CarrefourAttributes",
	definition(t) {
		t.string("ean")
		t.string("cdbase")
		t.string("title")
		t.string("brand")
		t.string("slug")
		//t.field("availability", { type: "CarrefourAttributesAvailability" })
		t.float("price")
		t.string("unitOfMeasure")
		t.string("perUnitLabel")
		t.string("taxMessage")
		t.float("perUnit")
		//t.field("ordering", { type: "CarrefourAttributesOrdering" })
		t.string("uri")
		t.field("categories", { type: "CarrefourAttributesCategories" })
		t.string("topCategoryName")
		///media/1500x1500/Photosite/PGC/P.L.S./3760214348141_PHOTOSITE_20151006_101015_0.jpg?placeholder=1
		t.list.field("images", {
			type: "CarrefourAttributesImages"
		})
		t.string("promotion")
		t.string("highlightLabel")
		///images/badges/flag-common-poulepleinair.svg
		t.list.field("flags", {
			type: "CarrefourAttributesFlags"
		})
		t.string("packaging")
		t.string("origin")
		t.string("format")
	},
})