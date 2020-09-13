import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql"
import { Inject, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersModel } from "./users.model"
import { UserInputDto } from "./dto/user-input.dto"
import { UserResponseDto } from "./dto/user-response.dto"
import { UserSigninInputDto } from "./dto/user-signin-input.dto"
import { AuthGuard } from "../../guards/auth.guard"
import { UserPayloadDto } from "./dto/user-payload.dto"

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
	async resetPassword(@Args("email") email: string): Promise<UserResponseDto> {
		return this.usersService.resetPassword(email)
	}

	/**
	 * Reset password
	 * @return Promise<UserResponseDto>
	 */
	@Mutation(() => UserResponseDto)
	async resetPasswordSave(@Args("token") token: string, @Args("password") password: string): Promise<UserResponseDto> {
		return this.usersService.resetPasswordSave(token, password)
	}
}