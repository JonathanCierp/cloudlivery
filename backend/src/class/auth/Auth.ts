// Classes
import {client, Redis} from "../redis/Redis"
import CustomError from "./CustomError"
// Utils
import {APP_SECRET} from "../../utils"
import {sign, verify} from "jsonwebtoken"
import {compare, hash} from "bcryptjs"
// Types
import {GetGen} from "nexus/dist/typegenTypeHelpers"
import {Token, TokenPayload, User} from "../../types/auth"

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

	/**
	 * Jwt ttl
	 * @type string
	 * @default process.env.REDIS_TTL
	 */
		// @ts-ignore
	protected _jwtTtl: string | undefined = process.env.REDIS_TTL

	/**
	 * App context
	 * @type GetGen<"context"> | undefined
	 * @default null
	 */
	protected _ctx: GetGen<"context"> | null = null

	/**
	 * User data
	 * @type Object
	 * @default {}
	 */
	protected _data: Object = {}

	/**
	 * Hashed password
	 * @type string
	 * @default empty string
	 */
	protected _hashedPassword: string = ""
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
	public setUser(user: User): void {
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

	/**
	 * Set jwt ttl
	 * @return void
	 * @param jwtTtl
	 */
	public setJwtTtl(jwtTtl: string | undefined): void {
		this._jwtTtl = jwtTtl
	}

	/**
	 * Get jwt ttl
	 * @return number
	 */
	public getJwtTtl(): string | undefined {
		return this._jwtTtl
	}

	/**
	 * Set context app
	 * @return void
	 * @param ctx
	 */
	public setCtx(ctx: GetGen<"context">): void {
		this._ctx = ctx
	}

	/**
	 * Get context app
	 * @return GetGen<"context">
	 */
	public getCtx(): GetGen<"context"> {
		//@ts-ignore
		return this._ctx
	}

	/**
	 * Set data
	 * @return void
	 * @param data
	 */
	public setData(data: object): void {
		this._data = data
	}

	/**
	 * Get jwt ttl
	 * @return GetGen<"context">
	 */
	public getData(): object {
		return this._data
	}

	/**
	 * Set hashed password
	 * @return void
	 * @param hashedPassword
	 */
	public setHashedPassword(hashedPassword: string): void {
		this._hashedPassword = hashedPassword
	}

	/**
	 * Get hashed password
	 * @return string
	 */
	public getHashedPassword(): string {
		return this._hashedPassword
	}
	//endregion

	//region Public Functions
	/**
	 * Set User to the class
	 * @return Promise<void>
	 */
	public async setPrismaUser(): Promise<void> {
		try {
			this.setData({
				email: this.getEmail()
			})
			const res = await this.getPrismaUser()

			if (!res) {
				CustomError.error("Aucun utilisateur pour cette adresse mail.")
			}

			//@ts-ignore
			this.setUser(res)
		} catch (e) {
			CustomError.error("Aucun utilisateur pour cette adresse mail.")
		}
	}

	/**
	 * Compare given password with database password
	 * @return Promise<void>
	 */
	public async comparePassword(): Promise<void> {
		try {
			const res = await compare(this.getPassword(), <string>this.getUser().password)

			if (!res) {
				CustomError.error("Mot de passe incorrect.")
			}
		} catch (e) {
			CustomError.error("Mot de passe incorrect.")
		}
	}

	/**
	 * Set jwt token to the class
	 * @return void
	 * @param prefix
	 * @param payload?
	 * @param options?
	 */
	public signToken(prefix: string = "signin_", payload?: object, options?: object): void {
		let payloadDatas = payload
		if(!payload) {
			payloadDatas = {
				userId: this.getUser().id
			}
		}
		let optionsDatas = options
		if(!options) {
			optionsDatas = {
				audience: "access_token",
				issuer: "cloudlivery",
				jwtid: "1",
				subject: "user"
			}
		}

		if (!this.getRememberMe()) {
			Object.assign(optionsDatas, {
				expiresIn: `${process.env.REDIS_TTL}s`
			})
		}

		// @ts-ignore
		this.setToken(sign(payloadDatas, APP_SECRET, optionsDatas))

		if (this.getRememberMe()) {
			redis.set(`${prefix}${this.getUser().id}`, this.getToken())
		} else {
			redis.set(`${prefix}${this.getUser().id}`, this.getToken(), String(process.env.REDIS_TTL))
		}
	}

	/**
	 * TODO NOT_IMPLEMENTED_YET
	 * @return void
	 * @param oldToken
	 */
	public refreshToken(oldToken: string): void {
		const payload: TokenPayload = verify(oldToken, APP_SECRET, {
			audience: "access_token",
			issuer: "cloudlivery"
		}) as TokenPayload

		// ?
		/*if(false) {*/
		delete payload.iat
		delete payload.exp
		delete payload.jti

		this.setToken(sign(payload, APP_SECRET, {jwtid: "2", expiresIn: this.getJwtTtl()}))
		/*}*/
	}

	/**
	 * Delete jwt token from the class
	 * @return Promise<void>
	 */
	public async deleteToken(prefix: string = "signin_"): Promise<void> {
		await redis.delete(`${prefix}${this.getId()}`)
		this.setToken("")
	}

	/**
	 * Extract user id from jwt received by http header
	 * @return number
	 */
	public extractIdFromJwt(): number {
		const Authorization = this.getToken() || this.getCtx().request.get("Authorization")

		if (Authorization) {
			const token = Authorization.replace("Bearer ", "")
			const verifiedToken: Token = verify(token, APP_SECRET) as Token
			
			return verifiedToken.userId
		} else {
			CustomError.error("Erreur lors de la recupération du token par le jwt.")
		}

		return -1
	}

	/**
	 * Extract user token from jwt received by http header
	 * @return string
	 */
	public extractTokenFromJwt(): string {
		const Authorization = this.getCtx().request.get("Authorization")

		if (Authorization) {
			return Authorization.replace("Bearer ", "")
		} else {
			CustomError.error("Erreur lors de la déconnexion.")
		}

		return ""
	}

	/**
	 * Check if token exist in redis
	 * @return string
	 * @param prefix
	 */
	public async existInRedis(prefix: string = "signin_"): Promise<boolean> {
		return await redis.compare(`${prefix}${this.getId()}`, this.getToken())
	}

	/**
	 * Create an user
	 * @return Promise<any>
	 */
	public async createUser(): Promise<any> {
		try {
			return await this.getCtx().prisma.user.create({
				// @ts-ignore
				data: this.getData() || this.getUser()
			})
		} catch (e) {
			CustomError.error("Erreur lors de la création de l'utilisateur.")
		}

		return ""
	}

	/**
	 * Create an user
	 * @return Promise<any>
	 */
	public async updateUser(): Promise<any> {
		try {
			return await this.getCtx().prisma.user.update({
				where: {
					id: this.getId()
				},
				data: this.getData()
			})
		} catch (e) {
			CustomError.error("Erreur lors de la modification de l'utilisateur.")
		}

		return ""
	}

	/**
	 * Get an user fetch by email
	 * @return Promise<any>
	 */
	public getPrismaUser(): Promise<any> {
		return this.getCtx().prisma.user.findOne({
			where: this.getData()
		})
	}

	/**
	 * Generate reset password url with token
	 * @return string
	 * @param prefix
	 */
	public generateResetPasswordUrl(prefix: string): string {
		const payloadDatas = {
			userId: this.getUser().id,
			type: "reset_password"
		}
		const options = {
			audience: "reset_password_token",
			issuer: "cloudlivery",
			jwtid: "3",
			subject: "user"
		}
		this.signToken(prefix, payloadDatas, options)

		return process.env.BASE_URL_FRONT + "/auth/password/reset/" + this.getToken()
	}

	/**
	 * Verify a token
	 * @return boolean
	 */
	public verifyToken(): boolean {
		const verifiedToken: Token = verify(this.getToken(), APP_SECRET) as Token

		return !!verifiedToken.userId
	}

	public async hashPassword(): Promise<void> {
		this.setHashedPassword(await hash(this.getPassword(), 10))
	}
	//endregion
}