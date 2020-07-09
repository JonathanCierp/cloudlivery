import { RedisConstant } from "./types/redis"

export const appSecret: string = process.env.APP_SECRET || ""

export const redisConstants: RedisConstant = {
	REDIS_PORT: 6379,
	REDIS_HOST: "51.77.211.195",
	REDIS_TTL: 3600,
	REDIS_TTL_JWT: "1h"
}