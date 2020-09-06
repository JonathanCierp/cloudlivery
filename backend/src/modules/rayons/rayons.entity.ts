import * as mongoose from "mongoose"

export const RayonsEntity = new mongoose.Schema({
	label: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	uri: String,
	code: String,
	level: Number
}, { timestamps: true })