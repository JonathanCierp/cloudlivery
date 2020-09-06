import { objectType } from "nexus"

export const ScrappingCarrefour2 = objectType({
	name: "ScrappingCarrefour2",
	definition(t) {
		t.int("count")
		t.list.field('carrefour', {
			type: "Produit"
		});
	},
})