import { objectType } from "nexus"

export const ResetPassword = objectType({
	name: "ResetPassword",
	definition(t) {
		t.boolean("valid")
	},
})