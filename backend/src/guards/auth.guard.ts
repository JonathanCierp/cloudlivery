import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { verify } from "jsonwebtoken"
import Redis from "../utils/redis/Redis";

@Injectable()
export class AuthGuard implements CanActivate {
	private logger = new Logger(AuthGuard.name)

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		if (ctx.headers && !ctx.headers.authorization) {
			return false
		}

		ctx.user = await this.validateToken(ctx.headers.authorization)
		ctx.token = ctx.headers.authorization.split(" ")[1]

		return true
	}

	async validateToken(auth: string) {
		if (auth.split(" ")[0] !== "Bearer") {
			this.logger.error("Erreur le jeton d'authentification est invalide : Bearer is missing", "AUTH_GUARD")
			throw new HttpException(`Erreur le jeton d'authentification est invalide`, HttpStatus.BAD_REQUEST)
		}
		const token = auth.split(" ")[1]

		try {
			const verifyToken = await verify(token, process.env.AUTH_SECRET)

			const redis = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST)
			const redisToken = await redis.get(`signin_${verifyToken.userId}`)
			redis.close()

			if(redisToken !== token) {
				throw new Error(`Erreur le jwt est invalide.`)
			}

			return verifyToken
		} catch (e) {
			this.logger.error(e.name + ": " + e.message, "AUTH_GUARD")
			throw new HttpException(`Erreur le jeton d'authentification est invalide`, HttpStatus.BAD_REQUEST)
		}
	}
}