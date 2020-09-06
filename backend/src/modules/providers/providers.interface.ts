import { Document } from "mongoose"

export interface ProvidersInterface extends Document {
	id?: string
	label: string
	prefix_url?: string
}