export interface Redis {
	isConnected: boolean
	init: () => any
	jwt: string
	set: (key: string, value: string) => void
	compare: (key: string, jwt: string) => Promise<boolean>
}

export interface RedisConstant {
	REDIS_PORT: number
	REDIS_HOST: string
	REDIS_TTL: number
	REDIS_TTL_JWT: string
}
