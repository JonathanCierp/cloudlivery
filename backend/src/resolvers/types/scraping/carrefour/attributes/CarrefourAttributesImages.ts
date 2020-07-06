import { objectType } from "nexus"

export const CarrefourAttributesImages = objectType({
	name: "CarrefourAttributesImages",
	definition(t) {
		t.string("largest")
		t.string("size1500x1500")
		t.string("size540x540")
		t.string("size380x380")
		t.string("size340x340")
		t.string("size340x240")
		t.string("size280x280")
		t.string("size195x195")
		t.string("size150x150")
		t.string("size43x43")
	},
})