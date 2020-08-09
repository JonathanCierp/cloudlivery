// Classes
import { client, Redis } from "../redis/Redis"
import CustomError from "../error/CustomError"
// Utils
import { appSecret } from "../../utils"
import { sign, verify } from "jsonwebtoken"
import { compare, hash } from "bcryptjs"
// Types
import { Data, Token, TokenOptions, TokenPayload, User } from "../../types/auth"
import { GetGen } from "nexus-plugin-prisma/dist/schema/typegen"

// Start redis
const redis = new Redis()
// Constants

export default class Auth {
	//region Protected parameters
	/**
	 * User id
	 * @type number | undefined
	 * @default undefined
	 */
	id: number | null | undefined
	/**
	 * User email
	 * @type string | undefined
	 * @default undefined
	 */
	email: string | undefined
	/**
	 * User id
	 * @type string | undefined
	 * @default undefined
	 */
	password: string | undefined
	/**
	 * User id
	 * @type User | undefined
	 * @default undefined
	 */
	user: User | undefined
	/**
	 * User id
	 * @type string | undefined
	 * @default undefined
	 */
	token: string | undefined
	/**
	 * TODO Check users connected >7d then ask password or if google auth ask again google connection
	 * Know if user perma connected
	 * true: 7d connected
	 * false: 3h
	 * @type boolean
	 * @default false
	 */
	rememberMe: boolean = false

	/**
	 * Jwt ttl
	 * @type string | undefined
	 * @default undefined
	 */
	jwtTtl: string | undefined

	/**
	 * App context
	 * @type GetGen<any> | undefined
	 * @default null
	 */
	ctx: GetGen<any> | undefined

	/**
	 * User data
	 * @type Data | undefined
	 * @default undefined
	 */
	data: Data | undefined

	/**
	 * Hashed password
	 * @type string | undefined
	 * @default undefined
	 */
	hashedPassword: string | undefined
	//endregion

	//region Public Functions
	/**
	 * Set User to the class
	 * @return Promise<void>
	 */
	async setPrismaUser(): Promise<void> {
		try {
			const res = await this.getPrismaUser()

			if (!res) {
				CustomError.userNotFoundByMail()
			}

			this.user = res
		} catch (e) {
			CustomError.request()
		}
	}

	/**
	 * Compare given password with database password
	 * @return Promise<boolean>
	 */
	async comparePassword(): Promise<boolean> {
		let bool = false

		try {
			if (this.user) {
				if (this.password != null && this.user.password != null) {
					bool = await compare(this.password, this.user.password)
				}
			}
		} catch (e) {
			CustomError.incorrectPassword()
		}

		if (!bool) {
			CustomError.incorrectPassword()
		}

		return bool
	}

	/**
	 * Set jwt token to the class
	 * @return void
	 * @param prefix
	 * @param payload?
	 * @param options?
	 */
	signToken(prefix: string, payload: TokenPayload, options: TokenOptions): void {
		this.token = sign(payload, appSecret, options)

		if(payload.type === "reset_password") {
			redis.set(`${prefix}${this.user?.id}`, this.token, String(3600))
		}else {
			if (this.rememberMe) {
				redis.set(`${prefix}${this.user?.id}`, this.token, String(process.env.REDIS_BIG_TTL))
			} else {
				redis.set(`${prefix}${this.user?.id}`, this.token, String(process.env.REDIS_TTL))
			}
		}
	}

	/**
	 * TODO NOT_IMPLEMENTED_YET
	 * @return void
	 * @param oldToken
	 */
	/*refreshToken(oldToken: string): void {
		const payload: TokenPayload = verify(oldToken, appSecret, {
			audience: "access_token",
			issuer: "cloudlivery"
		}) as TokenPayload

		delete payload.iat
		delete payload.exp
		delete payload.jti

		this.setToken(sign(payload, appSecret, {jwtid: "2", expiresIn: this.getJwtTtl()}))
	}*/

	/**
	 * Delete jwt token from the class
	 * @return Promise<void>
	 */
	async deleteToken(prefix: string = "signin_", error: string): Promise<void> {
		if(await redis.delete(`${prefix}${this.id}`)) {
			this.token = ""
		}else {
			CustomError.error(error)
		}
	}

	/**
	 * Extract user id from jwt received by http header
	 * @return number
	 */
	extractIdFromJwt(): number | null {
		const Authorization = this.token || this.ctx.request.get("Authorization")
		let userId: number | null = null

		if (Authorization) {
			const token = Authorization.replace("Bearer ", "")
			const verifiedToken: Token = verify(token, appSecret, (e: any, v: any) => {
				if(e) {
					CustomError.invalidToken()
				}

				return v
			}) as unknown as Token
			userId = verifiedToken.userId
		} else {
			CustomError.error("Erreur lors de la recupération du token par le jwt.")
		}

		return userId
	}

	/**
	 * Extract user token from jwt received by http header
	 * @return string
	 */
	extractTokenFromJwt(): string | undefined {
		const Authorization = this.ctx.request.get("Authorization")
		let token: string | undefined


		if (Authorization) {
			token = Authorization.replace("Bearer ", "")
		} else {
			CustomError.signout()
		}

		return token
	}

	/**
	 * Check if token exist in redis
	 * @return string
	 * @param prefix
	 */
	async existInRedis(prefix: string = "signin_"): Promise<boolean> {
		if(this.token) {
			return await redis.compare(`${prefix}${this.id}`, this.token)
		}
		
		return false
	}

	/**
	 * Create an user
	 * @return Promise<User>
	 */
	async createUser(): Promise<User> {
		return await this.ctx.prisma.user.create({
			data: this.user
		})
	}

	/**
	 * Create an user
	 * @return Promise<User>
	 */
	async updateUser(): Promise<User> {
		return await this.ctx.prisma.user.update({
			where: {
				id: this.id
			},
			data: this.user
		})
	}

	/**
	 * Get an user fetch by email
	 * @return Promise<User>
	 */
	async getPrismaUser(): Promise<User> {
		return await this.ctx.prisma.user.findOne({
			where: this.data
		})
	}

	/**
	 * Generate reset password url with token
	 * @return string
	 * @param prefix
	 */
	generateResetPasswordUrl(prefix: string): string {
		const payloadDatas: TokenPayload = {
			userId: this.user?.id,
			type: "reset_password"
		}

		const options: TokenOptions = {
			audience: "reset_password_token",
			issuer: "cloudlivery",
			jwtid: "3",
			subject: "user",
			expiresIn: "1h"
		}
		this.signToken(prefix, payloadDatas, options)

		return process.env.BASE_URL_FRONT + "/auth/password/reset/" + this.token
	}

	/**
	 * Verify a token
	 * @return boolean
	 */
	verifyToken(): boolean {
		let verifiedToken: Token = {
			userId: null
		}

		if (this.token != null) {
			verifiedToken = verify(this.token, appSecret) as Token
		}

		return !!verifiedToken.userId
	}

	async hashPassword(): Promise<string | undefined> {
		let password: string | undefined

		try {
			if (this.password != null) {
				password = await hash(this.password, 10)
			}
		}catch(e) {
			CustomError.error("Erreur lors de la création du compte utilisateur.")
		}

		return password
	}

	//endregion
}