// Classes
import {client, Redis} from "../redis/Redis"
import CustomError from "./CustomError"
// Utils
import {APP_SECRET} from "../utils"
import {sign, verify} from "jsonwebtoken"
import {compare} from "bcryptjs"
// Types
import {GetGen} from "nexus/dist/typegenTypeHelpers"
import {Token, TokenPayload, User} from "../types/auth"

// Start redis
const redis = new Redis(client)

export default class Auth {
	//region Protected parameters
		/**
		 * User id
		 * @type number
		 * @default -1
		 */
		protected _id: number = -1
		/**
		 * User email
		 * @type string
		 * @default empty string
		 */
		protected _email: string = ""
		/**
		 * User id
		 * @type string
		 * @default empty string
		 */
		protected _password: string = ""
		/**
		 * User id
		 * @type User
		 * @default null
		 */
		//@ts-ignore
		protected _user: User
		/**
		 * User id
		 * @type string
		 * @default empty string
		 */
		protected _token: string = ""
		/**
		 * TODO Check users connected >7d then ask password or if google auth ask again google connection
		 * Know if user perma connected
		 * true: 7d connected
		 * false: 3h
		 * @type boolean
		 * @default false
		 */
		protected _rememberMe: boolean = false
	//endregion

	//region Getters Setters
	/**
	 * Set email
	 * @return void
	 * @param email
	 */
	public setEmail(email: string): void {
		this._email = email
	}

	/**
	 * Get email
	 * @return string
	 */
	public getEmail(): string {
		return this._email
	}

	/**
	 * Set password
	 * @return void
	 * @param password
	 */
	public setPassword(password: string): void {
		this._password = password
	}

	/**
	 * Get password
	 * @return string
	 */
	public getPassword(): string {
		return this._password
	}

	/**
	 * Set user
	 * @return void
	 * @param user
	 */
	public setUser(user: User | null): void {
		//@ts-ignore
		this._user = user
	}

	/**
	 * Get user
	 * @return string
	 */
	public getUser(): User {
		return <User>this._user
	}

	/**
	 * Set token
	 * @return void
	 * @param token
	 */
	public setToken(token: string): void {
		this._token = token
	}

	/**
	 * Get token
	 * @return string
	 */
	public getToken(): string {
		return this._token
	}

	/**
	 * Set id
	 * @return void
	 * @param id
	 */
	public setId(id: number): void {
		this._id = id
	}

	/**
	 * Get id
	 * @return string
	 */
	public getId(): number {
		return this._id
	}

	/**
	 * Set rememberMe
	 * @return void
	 * @param rememberMe
	 */
	public setRememberMe(rememberMe: boolean): void {
		this._rememberMe = rememberMe
	}

	/**
	 * Get rememberMe
	 * @return boolean
	 */
	public getRememberMe(): boolean {
		return this._rememberMe
	}
	//endregion

	//region Public Functions
	/**
	 * Set User to the class
	 * @return Promise<void>
	 * @param ctx
	 */
	public async setPrismaUser(ctx: GetGen<"context">): Promise<void> {
		const email = this.getEmail()

		try{
			const res = await ctx.prisma.user.findOne({
				where: {
					email
				}
			})

			if(!res) {
				CustomError.error("Aucun utilisateur pour cette adresse mail.")
			}

			this.setUser(res)
		}catch (e) {
			CustomError.error("Aucun utilisateur pour cette adresse mail.")
		}
	}

	/**
	 * Compare given password with database password
	 * @return Promise<void>
	 */
	public async comparePassword(): Promise<void> {
		try{
			const res = await compare(this.getPassword(), this.getUser().password)

			if(!res) {
				CustomError.error("Mot de passe incorrect.")
			}
		}catch (e) {
			CustomError.error("Mot de passe incorrect.")
		}
	}

	/**
	 * Set jwt token to the class
	 * @return void
	 */
	public signToken(): void {
		this.setToken(sign( { userId: this.getUser().id }, APP_SECRET, {
			audience: "access_token",
			issuer: "cloudlivery",
			jwtid: "1",
			subject: "user",
			expiresIn: this.getRememberMe() ? process.env.REDIS_BIG_TTL_JWT : process.env.REDIS_TTL_JWT
		}))

		const ttl = this.getRememberMe() ? process.env.REDIS_BIG_TTL : process.env.REDIS_TTL
		redis.set(`signin_${this.getUser().id}`, this.getToken(), ttl)
	}

	/**
	 * TODO NOT_IMPLEMENTED_YET
	 * @return void
	 * @param oldToken
	 */
	public refreshToken(oldToken: string): void {
		const payload: TokenPayload = verify(oldToken, APP_SECRET, { audience: "access_token", issuer: "cloudlivery" }) as TokenPayload

		// ?
		/*if(false) {*/
			delete payload.iat
			delete payload.exp
			delete payload.jti

			this.setToken(sign(payload, APP_SECRET, { jwtid: "2", expiresIn: process.env.REDIS_TTL_JWT }))
		/*}*/
	}

	/**
	 * Delete jwt token from the class
	 * @return Promise<void>
	 */
	public async deleteToken(): Promise<void> {
		await redis.delete(`signin_${this.getId()}`)
		this.setToken("")
	}

	/**
	 * Extract user id from jwt received by http header
	 * @return number
	 * @param ctx
	 */
	public extractIdFromJwt(ctx: GetGen<"context">): number {
		const Authorization = ctx.request.get("Authorization")

		if (Authorization) {
			const token = Authorization.replace("Bearer ", "")
			const verifiedToken: Token = verify(token, APP_SECRET) as Token

			return verifiedToken.userId
		}else {
			CustomError.error("Erreur lors de la déconnexion.")
		}

		return -1
	}

	/**
	 * Extract user token from jwt received by http header
	 * @return string
	 * @param ctx
	 */
	public extractTokenFromJwt(ctx: GetGen<"context">): string {
		const Authorization = ctx.request.get("Authorization")

		if (Authorization) {
			return Authorization.replace("Bearer ", "")
		}else {
			CustomError.error("Erreur lors de la déconnexion.")
		}

		return ""
	}

	public async existInRedis(): Promise<boolean> {
		return await redis.compare(`signin_${this.getId()}`, this.getToken())
	}
	//endregion
}