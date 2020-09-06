import * as mongoose from "mongoose"

export const GroupRayonsSchema = new mongoose.Schema({
	label: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	type: String,
	urlCarrefour: String,
	urlAuchan: String,
	rayons: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Rayon"
	}
}, {timestamps: true})