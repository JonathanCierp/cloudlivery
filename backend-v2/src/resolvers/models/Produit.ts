import { objectType } from "@nexus/schema"

export const Produit = objectType({
	name: "Produit",
	definition(t) {
		t.int("id")
		t.field("provider", { type: "Provider" })
		t.field("marque", { type: "Marque" })
		t.string("lastname")
		t.string("firstname")
		t.string("email")
		t.string("civilite")

		t.datetime("updatedAt")
		t.datetime("createdAt")
	}
})