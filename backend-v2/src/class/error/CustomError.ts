export default class CustomError {

	/**
	 * Throw custom error
	 * @return void
	 * @param message
	 */
	static error(message: string): void {
		throw new Error(message)
	}
}