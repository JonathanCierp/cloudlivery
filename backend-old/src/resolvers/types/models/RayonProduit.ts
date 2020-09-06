import { objectType } from "nexus"

export const RayonProduit = objectType({
	name: "RayonProduit",
	definition(t) {
		t.model.id()
		t.model.rayon()
		t.model.rayon_id()
		t.model.produit_id()
		t.model.updatedAt()
		t.model.createdAt()
	}
})
