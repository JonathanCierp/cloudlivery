export interface User {
	id: Number
	google_id?: String
	email: String
	lastname: String
	firstname: String
	civilite: String
	password: String
	updatedAt: Date
	createdAt: Date
}

export interface Data {
	id?: String
	google_id?: String
	email?: String
}

export interface TokenPayload {
	userId: Number | undefined
	type: String
}

export interface TokenOptions {
	audience: String
	issuer: String
	jwtid: String
	subject: String
	expiresIn: String
}