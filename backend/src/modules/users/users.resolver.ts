import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql"
import { Inject, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersModel } from "./users.model"
import { UserInputDto } from "./dto/user-input.dto"
import { UserResponseDto } from "./dto/user-response.dto"
import { UserSigninInputDto } from "./dto/user-signin-input.dto"
import { AuthGuard } from "../../guards/auth.guard"
import { UserPayloadDto } from "./dto/user-payload.dto"
import Auth from "../../../../backend-v2/src/class/auth/Auth"
import Mail from "../../../../backend-v2/src/class/mail/Mail"
import CustomError from "../../../../backend-v2/src/class/error/CustomError"

@Resolver(of => UsersModel)
export class UsersResolver {
	constructor(@Inject(UsersService) private usersService: UsersService) {
	}

	/**
	 * @param input UserInputDto --> Payload send to create object
	 * Create one user
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	async signup(@Args("input") input: UserInputDto): Promise<UserResponseDto> {
		return this.usersService.create(input)
	}

	/**
	 * @param input UserSigninInputDto --> Payload send to create object
	 * Create one user
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	async signin(@Args("input") input: UserSigninInputDto): Promise<UserResponseDto> {
		return this.usersService.signin(input)
	}

	/**
	 * @param user UserPayloadDto --> Payload send to create object
	 * @param token String --> Payload send to create object
	 * Create one user
	 * @return Promise<UserResponseDto>
	 */
	@Query(() => UserResponseDto)
	@UseGuards(new AuthGuard())
	async me(@Context("user") user: UserPayloadDto, @Context("token") token: string): Promise<UserResponseDto> {
		return this.usersService.findOne(user.userId, token)
	}

	/**
	 * Create one user
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	@UseGuards(new AuthGuard())
	async signout(@Context("user") user: UserPayloadDto, @Context("token") token: string): Promise<UserResponseDto> {
		return this.usersService.signout(user.userId, token)
	}

	/**
	 * Allow reset password
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	async resetPassword(email: string): Promise<UserResponseDto> {
		return this.usersService.resetPassword(email)
	}

	/**
	 * Reset password
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	async resetPasswordSave(token: string, password: string): Promise<UserResponseDto> {
		return this.usersService.resetPasswordSave(token, password)
	}


	/*t.field("resetPassword", {
	type: "Default",
	args: {
		email: stringArg({nullable: false})
	},
	// @ts-ignore
	resolve: async (_parent, {email}, ctx) => {
	const auth = new Auth()

	// Set params info
	auth.ctx = ctx
	auth.data = {email}

	// If user exist
	auth.user = await auth.getPrismaUser()
	if (auth.user) {
		const url = auth.generateResetPasswordUrl("reset_password_")
		const mail = new Mail()
		mail.to = email
		mail.subject = "Création d'un compte sur cloudlivery.fr"
		mail.createTransport()
		mail.send("signup.ejs")
	}

	return {
		message: "Si votre email est connue, afin de réinitialiser votre mot de passe, un e-mail va vous être envoyé. Cela peut prendre quelques minutes."
	}
}
})
t.field("resetPasswordSave", {
	type: "Default",
	args: {
		token: stringArg({nullable: false}),
		password: stringArg({nullable: false})
	},
	// @ts-ignore
	resolve: async (_parent, {token, password}, ctx) => {
		const auth = new Auth()

		// Set params info
		auth.ctx = ctx
		auth.token = token
		auth.id = auth.extractIdFromJwt()
		auth.data = {id: auth.extractIdFromJwt()}
		auth.user = await auth.getPrismaUser()

		if (!await auth.existInRedis("reset_password_")) {
			CustomError.invalidToken()
		}

		if (auth.user) {
			auth.user.password = await hash(password, 10)
			await auth.updateUser()
			await auth.deleteToken("reset_password_", "Erreur lors de la modification du mot de passe.")
		}

		return {
			message: "Modification du mot de passe effectué avec succès."
		}
	}
})*/
}