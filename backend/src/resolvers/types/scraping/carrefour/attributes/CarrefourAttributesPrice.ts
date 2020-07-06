import { objectType } from "nexus"

export const CarrefourAttributesPrice = objectType({
	name: "CarrefourAttributesPrice",
	definition(t) {
		t.string("price")
		t.string("unitOfMeasure")
		t.string("perUnitLabel")
		t.string("taxMessage")
		t.string("perUnit")
	},
})