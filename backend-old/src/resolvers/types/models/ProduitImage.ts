import { objectType } from "nexus"

export const ProduitImage = objectType({
	name: "ProduitImage",
	definition(t) {
		t.model.id()
		t.model.produit_id()
		t.model.largest()
		t.model.size_1500x1500()
		t.model.size_540x540()
		t.model.size_380x380()
		t.model.size_340x340()
		t.model.size_340x240()
		t.model.size_280x280()
		t.model.size_195x195()
		t.model.size_150x150()
		t.model.size_43x43()
		t.model.updatedAt()
		t.model.createdAt()
	}
})
