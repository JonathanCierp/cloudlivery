// Classes
import {client, Redis} from "../redis/Redis"
import CustomError from "./CustomError"
import Auth from "./Auth";
// Utils
import {APP_SECRET} from "../../utils"
import {sign, verify} from "jsonwebtoken"
// Types
import {GetGen} from "nexus/dist/typegenTypeHelpers"
import {GoogleUserAuth} from "../../types/auth";

// Start redis
const redis = new Redis(client)

export default class GoogleAuth extends Auth {
	//region Protected parameters
	/**
	 * Google user
	 * @type GoogleUserAuth
	 * @default null
	 */
	//@ts-ignore
	private _googleUser: GoogleUserAuth
	//endregion

	//region Getters Setters
	/**
	 * Set google user
	 * @return void
	 * @param googleUser
	 */
	public setGoogleUser(googleUser: GoogleUserAuth): void {
		this._googleUser = googleUser
	}

	/**
	 * Get google user
	 * @return GoogleUserAuth
	 */
	public getGoogleUser(): GoogleUserAuth {
		return this._googleUser
	}
	//endregion

	//region Public Functions
	public async createUser(): Promise<any> {
		try {
			return await this.getCtx().prisma.user.create({
				data: this.getGoogleUser()
			})
		}catch (e) {
			console.log(e)
			CustomError.error("Erreur lors de la création de l'utilisateur google.")
		}

		return ""
	}
	//endregion
}