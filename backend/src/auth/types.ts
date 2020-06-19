export interface User {
	id: number
	lastname: string | null
	firstname: string | null
	email: string
	password: string
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