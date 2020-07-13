import { objectType } from "@nexus/schema"

export const ProduitImage = objectType({
	name: "ProduitImage",
	definition(t) {
		t.int("id")
		t.string("largest")
		t.string("size_1500x1500")
		t.string("size_540x540")
		t.string("size_380x380")
		t.string("size_340x340")
		t.string("size_340x240")
		t.string("size_280x280")
		t.string("size_195x195")
		t.string("size_150x150")
		t.string("size_43x43")
		t.datetime("updatedAt")
		t.datetime("createdAt")
	},
})