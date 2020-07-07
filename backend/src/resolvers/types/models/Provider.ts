import { objectType } from "nexus"

export const Provider = objectType({
	name: "Provider",
	definition(t) {
		t.model.id()
		t.model.label()
		t.model.updatedAt()
		t.model.createdAt()
	}
})
