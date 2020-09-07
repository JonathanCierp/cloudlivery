import { Document } from "mongoose"

export interface ProvidersInterface extends Document {
	id?: number
	label: string
	prefix_url?: string
}