import { Document } from "mongoose"
import { RayonsInterface } from "../rayons/rayons.interface"

export interface GroupRayonsInterface extends Document {
	id?: string
	label: string
	slug: string
	type?: string
	urlCarrefour?: string
	urlAuchan?: string
	rayons: RayonsInterface[]
}
