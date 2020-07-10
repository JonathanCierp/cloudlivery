export interface Provider {
	id: number
	label: string
}

export interface Marque {
	id: number
	label: string
}

export interface Format {
	id: number
	label: string
}

export interface LabelsQualite {
	id: number
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
