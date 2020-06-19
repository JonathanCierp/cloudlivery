//import Redis from "./types"
import { RedisClient } from "redis";
import { redisConstants } from "../utils"

const redisClient = require('redis')
const client = redisClient.createClient(redisConstants.REDIS_PORT, redisConstants.REDIS_HOST)

/*
client.on('connect', () => {
	console.log("------------ REDIS CONNECTED SUCCESS ------------")

	client.get("3600-11628-jwt ", (err: any, reply: string) => {
		redis.jwt = reply

		console.log("zad : " + redis.jwt)
	})

	redis.isConnected = true
})
const redis: Redis = {
	isConnected: false,
	jwt: "",
	init: () => {
		client.on('connect', () => {
			console.log("------------ REDIS CONNECTED SUCCESS ------------")

			client.get("3600-11628-jwt ", (err: any, reply: string) => {
				redis.jwt = reply

				console.log("zad : " + redis.jwt)
			})

			redis.isConnected = true
		})
		client.on('error', () => {
			console.log("------------ REDIS CONNECTED ERROR ------------")

			redis.isConnected = false
		})
	},
	set: (key: string, value: string) => {
		client.set(key, value, "EX", process.env.REDIS_TTL)
	},
	compare: async (key: string, jwt: string): Promise<boolean> => {
		var bool = false

		await client.get(key, (err: any, reply: string) => {
			bool = jwt === reply
			redis.jwt = reply

			console.log("zad : " + redis.jwt)
		})

		console.log("bool : " + bool)

		return true
	}
}
*/

class Redis {
	_client: any;

	constructor(client: RedisClient) {
		this._client = client;

		this.init()
	}

	init() {
		this._client.on('connect', () => {
			console.log("------------ REDIS CONNECTED SUCCESS ------------")

		})
		this._client.on('error', () => {
			console.log("------------ REDIS CONNECTED ERROR ------------")

		})
	}

	async get(key: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			this._client.get(key, (err: any, reply: string) => {
				resolve(reply);
			});
		});
	}

	set(key: string, value: string, ttl = process.env.REDIS_TTL): void {
		this._client.set(key, value, "EX", ttl)
	}

	async delete(key: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			this._client.del(key, (err: any, reply: number) => {
				reply === 1 ? resolve("Déconnecté avec succès.") : reject("Erreur lors de la déconnexion")
			});
		});
	}

	compare(key: string, jwt: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this._client.get(key, (err: any, reply: string) => {
				if(err) {
					reject("not exist")
				}
				jwt === reply ? resolve(true) : reject("not equals")
			})
		})
		.then(response => {
			return response
		})
		.catch(error => {
			return error
		})
	}

	close() {
		this._client.quit()
	}
}

export {
	Redis,
	client
}