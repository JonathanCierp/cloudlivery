import { objectType } from "@nexus/schema"

export const Produit = objectType({
	name: "Produit",
	definition(t) {
		t.int("id")
		t.field("provider", { type: "Provider" })
		t.field("marque", { type: "Marque" })
		t.list.field("produit_images", { type: "ProduitImage" })
		t.list.field("produit_labels_qualites", { type: "ProduitLabelsQualite" })
		t.list.field("produit_rayons", { type: "ProduitRayon" })
		t.string("label")
		t.string("brand")
		t.string("ean")
		t.string("slug")
		t.string("uri")
		t.string("packaging")
		t.string("origin")
		t.string("format")
		t.string("price")
		t.string("unit_of_measure")
		t.string("per_unit_label")
		t.string("tax_message")
		t.string("per_unit")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	}
})