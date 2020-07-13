import { objectType } from "@nexus/schema"

export const DefaultProduit = objectType({
	name: "DefaultProduit",
	definition(t) {
		t.int("count")
		t.list.field('data', {
			type: "Produit"
		});
	},
})