import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UsersModel } from "./users.model"
import { UserInputDto } from "./dto/user-input.dto"
import { AppService } from "../../app.service"
import { UsersInterface } from "./users.interface"
import { UserResponseDto } from "./dto/user-response.dto"
import { UserSigninInputDto } from "./dto/user-signin-input.dto"
import { sign } from "jsonwebtoken"
import { compare, hash } from "bcrypt"
import Redis from "../../utils/redis/Redis"

@Injectable()
export class UsersService extends AppService implements UsersInterface {
	private logger = new Logger(UsersService.name)
	protected item?: UsersModel | undefined
	protected items?: UsersModel[] | undefined

	constructor(@InjectRepository(UsersModel) private usersModel: Repository<UsersModel>) {
		super()
	}

	formattedResponseUsers(): UserResponseDto {
		return {
			...this.formattedResponse(),
			items: this.items,
			item: this.item
		}
	}

	/**
	 * @param id Number --> Get a user by id
	 * @param token String --> Payload send to create object
	 * Get one user
	 * @return Promise<UserResponseDto>
	 */
	async findOne(id: number, token: string): Promise<UserResponseDto>{
		try {
			this.code = HttpStatus.OK
			this.details = null

			// Check redis
			const redis = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST)
			const redisToken = await redis.get(`signin_${id}`)
			redis.close()

			if(redisToken !== token) {
				this.message = `Erreur vous n'êtes plus connectés.`
				throw new Error(`Erreur le jwt est invalide.`)
			}

			this.token = token
			this.item = await this.usersModel.findOne(id)
			this.message = `Utilisateur récupéré avec succès.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la récupération de l'utilisateur.`
			this.item = null
		}

		return this.formattedResponseUsers()
	}

	/**
	 * @param userInputDto UserInputDto --> Payload send to create object
	 * Create one user
	 * @return Promise<UserResponseDto>
	 */
	async create(userInputDto: UserInputDto): Promise<UserResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (userInputDto.password === "") {
				this.message = `Erreur le mot de passe ne peut pas être vide.`
				throw new Error(`Erreur lors de la création du compte: ${userInputDto.email}`)
			}

			if (userInputDto.email === "") {
				this.message = `Erreur l'email ne peut pas être vide.`
				throw new Error(`Erreur lors de la création du compte: ${userInputDto.email}`)
			}

			if (!userInputDto.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
				this.message = `Erreur l'email est invalide.`
				throw new Error(`Erreur lors de la création du compte: ${userInputDto.email}`)
			}

			const exist = await this.usersModel.findOne({ email: userInputDto.email })

			if (exist) {
				this.message = `Erreur un compte existe déjà pour ce mail.`
				throw new Error(`Erreur lors de la création du compte: ${userInputDto.email}`)
			}

			userInputDto.password = await hash(userInputDto.password, 10)
			this.item = await this.usersModel.save(this.usersModel.create(userInputDto))
			
			if (!this.item) {
				this.message = `Erreur un compte existe déjà pour ce mail.`
				throw new Error(`Erreur lors de la création du compte: ${userInputDto.email}`)
			}

			/* TODO envoi de mail + mutation activate account */

			this.message = `Utilisateur créé avec succès.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la création de l'utilisateur.`
			this.item = null
		}

		this.token = null
		return this.formattedResponseUsers()
	}

	/**
	 * @param userSigninInputDto UserSigninInputDto --> Payload send to create object
	 * Login user
	 * @return Promise<UserResponseDto>
	 */
	async signin(userSigninInputDto: UserSigninInputDto): Promise<UserResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			if (userSigninInputDto.email === "") {
				this.message = `Erreur l'email ne peut pas être vide.`
				throw new Error(`Erreur lors de la connexion: ${userSigninInputDto.email}`)
			}

			if (!userSigninInputDto.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
				this.message = `Erreur l'email est invalide.`
				throw new Error(`Erreur lors de la connexion: ${userSigninInputDto.email}`)
			}

			if (userSigninInputDto.password === "") {
				this.message = `Erreur le mot de passe ne peut pas être vide.`
				throw new Error(`Erreur lors de la connexion: ${userSigninInputDto.email}`)
			}

			this.item = await this.usersModel.findOne( { email: userSigninInputDto.email })
			
			if (!await compare(userSigninInputDto.password, this.item.password)) {
				this.message = `Erreur mauvais mot de passe.`
				throw new Error(`Erreur lors de la connexion: ${userSigninInputDto.email}`)
			}

			this.token = sign({
				userId: this.item.id,
				type: "signin"
			}, process.env.JWT_SECRET, {
				audience: "access_token",
				issuer: "cloudlivery",
				jwtid: "1",
				subject: "user",
				expiresIn: "1h"
			})

			const redis = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST)
			redis.set(`signin_${this.item.id}`, this.token)
			redis.close()

			this.message = `Utilisateur connecté avec succès.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la connexion.`
			this.item = null
		}

		return this.formattedResponseUsers()
	}

	/**
	 * @param id Number --> Get a user by id
	 * @param token String --> Payload send to create object
	 * Logout user
	 * @return Promise<UserResponseDto>
	 */
	async signout(id: number, token: string): Promise<UserResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const redis = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST)
			const redisToken = await redis.get(`signin_${id}`)
			const isDeleteInRedis = await redis.delete(`signin_${id}`)
			redis.close()

			if(isDeleteInRedis) {
				this.message = `Erreur lors de la déconnexion.`
				throw new Error(`Erreur le jwt n'est plus dans le redis.`)
			}

			if(redisToken !== token) {
				this.message = `Erreur vous n'êtes plus connectés.`
				throw new Error(`Erreur le jwt est invalide.`)
			}

			this.message = `Déconnecté avec succès.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la déconnexion.`
			this.item = null
		}

		return this.formattedResponseUsers()
	}

	/**
	 * @param email String --> Email of user
	 * Activate account and send url + token
	 * @return Promise<UserResponseDto>
	 */
	async resetPassword(email: string): Promise<UserResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			const user = await this.usersModel.findOne({ email })

			if (user) {
				this.message = `Erreur aucun compte n'est associé à ce mail.`
				throw new Error(`Erreur aucun compte n'est associé à ce mail : ${email}`)
			}

			this.token = sign({
				userId: user.id,
				type: "reset_password"
			}, process.env.JWT_SECRET_RESET, {
				audience: "reset_password_token",
				issuer: "cloudlivery",
				jwtid: "3",
				subject: "user",
				expiresIn: "1h"
			})

			/* TODO envoi de mail */

			this.item = null
			this.message = `Si votre email est connue, afin de réinitialiser votre mot de passe, un e-mail va vous être envoyé. Cela peut prendre quelques minutes.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la demande de réinitialisation de mot de passe.`
			this.item = null
		}

		return this.formattedResponseUsers()
	}

	/**
	 * @param token String --> Payload send to create object
	 * @param password String --> Get a user by id
	 * Activate account
	 * @return Promise<UserResponseDto>
	 */
	async resetPasswordSave(token: string, password: string): Promise<UserResponseDto> {
		try {
			this.code = HttpStatus.OK
			this.details = null

			this.message = `Déconnecté avec succès.`
		} catch (e) {
			this.code = HttpStatus.BAD_REQUEST
			this.details = e.message
			this.logger.error(this.details, "USER")
			this.message = this.message || `Erreur lors de la déconnexion.`
			this.item = null
		}

		return this.formattedResponseUsers()
	}
}
