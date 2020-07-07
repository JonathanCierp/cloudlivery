import { objectType } from "nexus"

export const ProduitFlag = objectType({
	name: "ProduitFlag",
	definition(t) {
		t.model.id()
		t.model.produit_id()
		t.model.label()
		t.model.updatedAt()
		t.model.createdAt()
	}
})
