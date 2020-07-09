export interface User {
	id?: number
	google_id?: string
	email: string
	lastname: string
	firstname: string
	civilite?: string
	password?: string
	updatedAt?: Date
	createdAt?: Date
}

export interface Data {
	id?: number
	google_id?: string
	email?: string
	password?: string
}

export interface TokenPayload {
	userId: number | undefined
	type: string
}

export interface TokenOptions {
	audience: string
	issuer: string
	jwtid: string
	subject: string
	expiresIn: string
}

export interface Token {
	userId: number
}