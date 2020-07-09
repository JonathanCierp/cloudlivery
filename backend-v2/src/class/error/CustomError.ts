export default class CustomError {

	/**
	 * Throw custom error
	 * @return void
	 * @param message
	 */
	static error(message: string): void {
		throw new Error(message)
	}

	/**
	 * Throw create user error
	 * @return void
	 * @param message
	 */
	static createUser(message: string = "\"Erreur lors de la création de l'utilisateur.\""): void {
		throw new Error(message)
	}

	/**
	 * Throw update user error
	 * @return void
	 * @param message
	 */
	static updateUser(message: string = "Erreur lors de la modification de l'utilisateur."): void {
		throw new Error(message)
	}

	/**
	 * Throw request error
	 * @return void
	 * @param message
	 */
	static request(message: string = "Erreur lors de la requête."): void {
		throw new Error(message)
	}

	/**
	 * Throw user not found error
	 * @return void
	 * @param message
	 */
	static userNotFound(message: string = "Aucun utilisateur trouvé."): void {
		throw new Error(message)
	}

	/**
	 * Throw user not found by mail error
	 * @return void
	 * @param message
	 */
	static userNotFoundByMail(message: string = "Aucun utilisateur pour cette adresse mail."): void {
		throw new Error(message)
	}

	/**
	 * Throw incorrect password error
	 * @return void
	 * @param message
	 */
	static incorrectPassword(message: string = "Mot de passe incorrect."): void {
		throw new Error(message)
	}

	/**
	 * Throw signout error
	 * @return void
	 * @param message
	 */
	static signout(message: string = "Erreur lors de la déconnexion."): void {
		throw new Error(message)
	}

	/**
	 * Throw signout error
	 * @return void
	 * @param message
	 */
	static invalidToken(message: string = "La clé n'est plus valide."): void {
		throw new Error(message)
	}
}