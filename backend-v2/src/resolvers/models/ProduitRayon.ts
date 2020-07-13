import { objectType } from "@nexus/schema"

export const ProduitRayon = objectType({
	name: "ProduitRayon",
	definition(t) {
		t.field("rayon", { type: "Rayon" })
	},
})