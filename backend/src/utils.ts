import { verify } from "jsonwebtoken"
import { Context } from "./context"
import { RedisConstant } from "./redis/types"

export const APP_SECRET: string = process.env.APP_SECRET || ""

export const redisConstants: RedisConstant = {
	REDIS_PORT: 6379,
	REDIS_HOST: "51.77.211.195",
	REDIS_TTL: 3600,
	REDIS_TTL_JWT: "1h"
}

interface Token {
	userId: string
}

export function getUserId(context: Context) {
	const Authorization = context.request.get("Authorization")
	if (Authorization) {
		const token = Authorization.replace("Bearer ", "")
		const verifiedToken = verify(token, APP_SECRET) as Token

		return verifiedToken && verifiedToken.userId
	}
}