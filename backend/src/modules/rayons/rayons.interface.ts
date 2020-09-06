import { Document } from "mongoose"

export interface RayonsInterface extends Document {
	id?: string
	label: string
	slug: string
	uri?: string
	code?: string
	level?: number
}