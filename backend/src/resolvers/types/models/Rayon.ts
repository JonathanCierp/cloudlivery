import { objectType } from "nexus"

export const Rayon = objectType({
	name: "Rayon",
	definition(t) {
		t.model.id()
		t.model.provider_id()
		t.model.code()
		t.model.label()
		t.model.slug()
		t.model.level()
		t.model.resultats()
		t.model.updatedAt()
		t.model.createdAt()
	}
})
