import { objectType } from "nexus"

export const ScrappingCarrefour = objectType({
	name: "ScrappingCarrefour",
	definition(t) {
		t.int("count")
		t.list.field('carrefour', {
			type: "Carrefour"
		});
	},
})