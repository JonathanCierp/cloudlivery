// Packages
import { RedisClient } from "redis"
// Constants
import { redisConstants } from "../utils"

const redisClient = require('redis')
const client = redisClient.createClient(redisConstants.REDIS_PORT, redisConstants.REDIS_HOST)

class Redis {

	//region Protected parameters
	/**
	 * Client redis
	 * @type any
	 * @default null
	 */
	_client: any
	//endregion

	//region Getters Setters
	/**
	 * Set client
	 * @return void
	 * @param client
	 */
	public setClient(client: any): void {
		this._client = client
	}
	/**
	 * Get client
	 * @return any
	 */
	public getClient(): any {
		return this._client
	}
	//endregion

	/**
	 * Constructor of the class
	 * @param client
	 */
	constructor(client: RedisClient) {
		this.setClient(client)

		this.init()
	}

	/**
	 * Constructor of the class
	 * @return void
	 */
	init(): void {
		this.getClient().on('connect', () => {
			console.log("------------ REDIS CONNECTED SUCCESS ------------")

		})
		this.getClient().on('error', () => {
			console.log("------------ REDIS CONNECTED ERROR ------------")

		})
	}

	/**
	 * Get token from redis
	 * @return Promise<string>
	 * @param key
	 */
	async get(key: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			this.getClient().get(key, (err: any, reply: string) => {
				resolve(reply)
			})
		})
	}

	/**
	 * Set token in the redis
	 * @return void
	 * @param key
	 * @param value
	 * @param ttl
	 */
	set(key: string, value: string, ttl: string | null = null): void {
		if(ttl) {
			this.getClient().set(key, value, "EX", ttl)
		}else {
			this.getClient().set(key, value)
		}
	}

	/**
	 * Delete token in redis
	 * @return Promise<string>
	 * @param key
	 */
	async delete(key: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			this.getClient().del(key, (err: any, reply: number) => {
				reply === 1 ? resolve("Déconnecté avec succès.") : reject("Erreur lors de la déconnexion")
			})
		})
	}

	/**
	 * Compare given token with token in redis
	 * @return Promise<any>
	 * @param key
	 * @param jwt
	 */
	compare(key: string, jwt: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this._client.get(key, (err: any, reply: string) => {
				if(err) {
					reject(false)
				}
				jwt === reply ? resolve(true) : reject(false)
			})
		})
		.then(response => {
			return response
		})
		.catch(error => {
			return error
		})
	}

	/**
	 * Close redis connection
	 * @return void
	 */
	close(): void {
		this.getClient().quit()
	}
}

export {
	Redis,
	client
}