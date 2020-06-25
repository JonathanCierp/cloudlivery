import { objectType } from "nexus"

export const Scrapping = objectType({
	name: "Scrapping",
	definition(t) {
		t.field("products", { type: "ScrappingItem" })
	}
})