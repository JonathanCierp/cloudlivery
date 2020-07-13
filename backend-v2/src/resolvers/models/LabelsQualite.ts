import { objectType } from "@nexus/schema"

export const LabelsQualite = objectType({
	name: "LabelsQualite",
	definition(t) {
		t.int("id")
		t.string("label")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	},
})