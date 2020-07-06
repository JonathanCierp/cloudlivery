// Classes
import CustomError from "../auth/CustomError"
// Packages
const nodemailer = require("nodemailer")
const ejs = require("ejs")
// Types
import { Transporter } from "nodemailer"

export default class Mail {
	//region Protected parameters
	/**
	 * Host
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_HOST
	 */
	private _host: string = process.env.NODE_MAILER_TRANSPORT_HOST || ""

	/**
	 * Port
	 * @type string | number
	 * @default process.env.NODE_MAILER_TRANSPORT_PORT
	 */
	private _port: string | number = process.env.NODE_MAILER_TRANSPORT_PORT || ""

	/**
	 * Auth user
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_USER
	 */
	private _user: string = process.env.NODE_MAILER_TRANSPORT_USER || ""

	/**
	 * Auth password
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_PASS
	 */
	private _pass: string = process.env.NODE_MAILER_TRANSPORT_PASS || ""

	/**
	 * Mail from
	 * @type string
	 * @default process.env.NODE_MAILER_OPTION_FROM
	 */
	private _from: string = process.env.NODE_MAILER_OPTION_FROM || ""

	/**
	 * Host
	 * @type string
	 * @default __dirname + "/templates/"
	 */
	private _filePrefix: string = __dirname + "/templates/"

	/**
	 * Variables
	 * @type object
	 * @default {}
	 */
	private _variables: object = { name: "Jonathan" }

	private _transporter: Transporter | undefined = undefined

	/**
	 * Mail to
	 * @type string
	 * @default empty string
	 */
	private _to: string = ""

	/**
	 * Mail subject
	 * @type string
	 * @default empty string
	 */
	private _subject: string = ""
	//endregion

	//region Getters Setters
	/**
	 * Set host
	 * @return void
	 * @param host
	 */
	public setHost(host: string): void {
		this._host = host
	}

	/**
	 * Get host
	 * @return string
	 */
	public getHost(): string {
		return this._host
	}

	/**
	 * Set port
	 * @return void
	 * @param port
	 */
	public setPort(port: string | number): void {
		this._port = port
	}

	/**
	 * Get port
	 * @return string | number
	 */
	public getPort(): string | number {
		return this._port
	}

	/**
	 * Set auth user
	 * @return void
	 * @param user
	 */
	public setUser(user: string): void {
		this._user = user
	}

	/**
	 * Get auth user
	 * @return string
	 */
	public getUser(): string {
		return this._user
	}

	/**
	 * Set auth password
	 * @return void
	 * @param pass
	 */
	public setPass(pass: string): void {
		this._pass = pass
	}

	/**
	 * Get auth password
	 * @return string
	 */
	public getPass(): string {
		return this._pass
	}

	/**
	 * Set mail from
	 * @return void
	 * @param from
	 */
	public setFrom(from: string): void {
		this._from = from
	}

	/**
	 * Get mail from
	 * @return string
	 */
	public getFrom(): string {
		return this._from
	}

	/**
	 * Set file prefix
	 * @return void
	 * @param filePrefix
	 */
	public setFilePrefix(filePrefix: string): void {
		this._filePrefix = filePrefix
	}

	/**
	 * Get file prefix
	 * @return string
	 */
	public getFilePrefix(): string {
		return this._filePrefix
	}

	/**
	 * Set file prefix
	 * @return void
	 * @param variables
	 */
	public setVariables(variables: object): void {
		this._variables = variables
	}

	/**
	 * Get file prefix
	 * @return string
	 */
	public getVariables(): object {
		return this._variables
	}

	/**
	 * Set transporter
	 * @return void
	 * @param transporter
	 */
	public setTransporter(transporter: Transporter | undefined): void {
		this._transporter = transporter
	}

	/**
	 * Get transporter
	 * @return Transporter | undefined
	 */
	public getTransporter(): Transporter | undefined {
		return this._transporter
	}

	/**
	 * Set to
	 * @return void
	 * @param to
	 */
	public setTo(to: string): void {
		this._to = to
	}

	/**
	 * Get to
	 * @return string
	 */
	public getTo(): string {
		return this._to
	}

	/**
	 * Set subject
	 * @return void
	 * @param subject
	 */
	public setSubject(subject: string): void {
		this._subject = subject
	}

	/**
	 * Get subject
	 * @return string
	 */
	public getSubject(): string {
		return this._subject
	}
	//endregion

	//region Public Functions
	public createTransport(): void {
		const transporter = nodemailer.createTransport({
			host: this.getHost(),
			port: this.getPort(),
			auth: {
				user: this.getUser(),
				pass: this.getPass()
			}
		})

		this.setTransporter(transporter)
	}

	public verify(): void {
		this.getTransporter()?.verify((error: any, success: any) => {
			if (error) {
				CustomError.error(error)
			} else {
				console.log("Server is ready to take messages")
			}
		})
	}

	public send(file: string, callback?: (err: any, data: any) => void) {
		let mailCallback = callback

		if(!callback) {
			mailCallback = (err: any, data: any) => {
				if (err) {
					console.log(err)
				} else {
					const mailOptions = {
						from: this.getFrom(),
						to: this.getTo(),
						subject: this.getSubject(),
						html: data
					}

					// @ts-ignore
					this.getTransporter().sendMail(mailOptions, (error: any, info: { response: string }) => {
						if (error) {
							console.log(error)
						} else {
							console.log("Email sent: " + info.response)
						}
					})
				}
			}
		}

		ejs.renderFile(this.getFilePrefix() + file, this.getVariables(), mailCallback)
	}
	//endregion
}