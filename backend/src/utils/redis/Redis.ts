import { createClient, RedisClient } from "redis"

export default class Redis {
	//region Protected parameters
	/**
	 * Client redis
	 * @type any
	 * @default null
	 */
	client: RedisClient

	//endregion

	/**
	 * Constructor of the class
	 * @param port
	 * @param host
	 */
	constructor(port: number, host: string) {
		this.client = createClient(port, host)

		this.init()
	}

	/**
	 * Constructor of the class
	 * @return void
	 */
	init(): void {
		this.client.on("connect", () => {
			console.log("------------ REDIS CONNECTED SUCCESS ------------")

		})
		this.client.on("error", (e) => {
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
			this.client.get(key, (err: any, reply: string) => {
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
		this.client.set(key, value, "EX", 3600)
		/*if(ttl) {
			this.client.set(key, value, "EX", 3600)
		}else {
			this.client.set(key, value)
		}*/
	}
	/**
	 * Delete token in redis
	 * @return Promise<string>
	 * @param key
	 */
	async delete(key: string): Promise<any> {
		return await new Promise((resolve, reject) => {
			this.client.del(key, (err: any, reply: number) => {
				reply === 1 ? resolve(true) : reject(false)
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
	 * Compare given token with token in redis
	 * @return Promise<any>
	 * @param key
	 * @param jwt
	 */
	compare(key: string, jwt: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.client.get(key, (err: any, reply: string) => {
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
		this.client.quit()
	}
}