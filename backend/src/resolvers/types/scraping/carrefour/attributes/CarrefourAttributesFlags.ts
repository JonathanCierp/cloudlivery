import { objectType } from "nexus"

export const CarrefourAttributesFlags = objectType({
	name: "CarrefourAttributesFlags",
	definition(t) {
		t.string("label")
	},
})