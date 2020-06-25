import { objectType } from "nexus"

export const Scraping = objectType({
	name: "Scraping",
	definition(t) {
		t.field("user", { type: "User" })
	},
})