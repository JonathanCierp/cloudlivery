import { objectType } from "@nexus/schema"

export const ProduitLabelsQualite = objectType({
	name: "ProduitLabelsQualite",
	definition(t) {
		t.field("labels_qualite", { type: "LabelsQualite" })
	},
})