export interface User {
	id: number
	google_id: string | null
	lastname: string | null
	firstname: string | null
	email: string
	civilite: string
	password: string | null
	updatedAt: Date
	createdAt: Date
}

export interface Token {
	userId: number
}

export interface TokenPayload {
	userId: number,
	iat: number,
	exp: number,
	aud: string,
	iss: string,
	sub: string,
	jti: string
}

export interface GoogleUserAuth {
	id: number
	google_id: string
	lastname: string
	firstname: string
	email: string
	rememberMe: boolean
}