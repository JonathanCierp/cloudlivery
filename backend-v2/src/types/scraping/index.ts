export interface Provider {
	id?: number
	label: string,
	prefix_url: string
}

export interface Marque {
	id?: number
	label: string
}

export interface Format {
	id: number
	label: string
}

export interface LabelsQualite {
	id?: number
	label: string
}

export interface PreferencesAlimentaire {
	id: number
	label: string
}

export interface Promotion {
	id: number
	label: string
}

export interface SubstancesControversee {
	id: number
	label: string
}

export interface Rayon {
	id?: number
	provider_id?: number
	label: string
	code: string
	slug: string
	uri: string
	level: number
	resultats: number
	scraping: boolean
}

export interface ProduitImage {
	largest: string
	size_1500x1500: string
	size_540x540: string
	size_380x380: string
	size_340x340: string
	size_340x240: string
	size_280x280: string
	size_195x195: string
	size_150x150: string
	size_43x43: string
}

export interface Produit {
	id: number
	provider: Provider
	marque: Marque
	produit_images: ProduitImage[]
	produit_labels_qualites: LabelsQualite[]
	label: string
	brand?: string
	ean: string
	slug: string
	uri?: string
	packaging?: string
	origin?: string
	format?: string
	price: number
	unit_of_measure: string
	per_unit_label: string
	tax_message?: string
	per_unit: number
}
