import { objectType } from "nexus"

export const User = objectType({
	name: "User",
	definition(t) {
		t.model.id()
		t.model.lastname()
		t.model.firstname()
		t.model.email()
		//t.model.posts({ pagination: false })
		t.model.updatedAt()
		t.model.createdAt()
	}
})