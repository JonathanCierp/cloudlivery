import { objectType } from "nexus"

export const Produit = objectType({
	name: "Produit",
	definition(t) {
		t.model.id()
		t.model.rayon_produits()
		t.model.produit_images()
		t.model.produit_flags()
		t.model.provider()
		t.model.provider_id()
		t.model.label()
		t.model.brand()
		t.model.slug()
		t.model.uri()
		t.model.packaging()
		t.model.origin()
		t.model.format()
		t.model.price()
		t.model.unit_of_measure()
		t.model.per_unit_label()
		t.model.tax_message()
		t.model.per_unit()
		t.model.updatedAt()
		t.model.createdAt()
	}
})