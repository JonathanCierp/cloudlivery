// Classes
import CustomError from "../error/CustomError";
// Types
import { Transporter } from "nodemailer"
// Packages
const nodemailer = require("nodemailer")
const ejs = require("ejs")

export default class Mail {
	//region Protected parameters
	/**
	 * Host
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_HOST
	 */
		host: string = process.env.NODE_MAILER_TRANSPORT_HOST || ""

	/**
	 * Port
	 * @type string | number
	 * @default process.env.NODE_MAILER_TRANSPORT_PORT
	 */
		port: string | number = process.env.NODE_MAILER_TRANSPORT_PORT || ""

	/**
	 * Auth user
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_USER
	 */
		user: string = process.env.NODE_MAILER_TRANSPORT_USER || ""

	/**
	 * Auth password
	 * @type string
	 * @default process.env.NODE_MAILER_TRANSPORT_PASS
	 */
		pass: string = process.env.NODE_MAILER_TRANSPORT_PASS || ""

	/**
	 * Mail from
	 * @type string
	 * @default process.env.NODE_MAILER_OPTION_FROM
	 */
		from: string = process.env.NODE_MAILER_OPTION_FROM || ""

	/**
	 * Host
	 * @type string
	 * @default __dirname + "/templates/"
	 */
		filePrefix: string = __dirname + "/templates/"

	/**
	 * Variables
	 * @type object
	 * @default {}
	 */
		variables: object = { name: "Jonathan" }

		transporter: Transporter | undefined = undefined

	/**
	 * Mail to
	 * @type string
	 * @default empty string
	 */
		to: string = ""

	/**
	 * Mail subject
	 * @type string
	 * @default empty string
	 */
		subject: string = ""
	//endregion

	//region 	Functions
		createTransport(): void {
			this.transporter = nodemailer.createTransport({
				host: this.host,
				port: this.port,
				auth: {
					user: this.user,
					pass: this.pass
				}
			})
		}

		verify(): void {
		this.transporter?.verify((error: any, success: any) => {
			if (error) {
				CustomError.error(error)
			} else {
				console.log("Server is ready to take messages")
			}
		})
	}

		send(file: string, callback?: (err: any, data: any) => void) {
		let mailCallback = callback

		if(!callback) {
			mailCallback = (err: any, data: any) => {
				if (err) {
					console.log(err)
				} else {
					const mailOptions = {
						from: this.from,
						to: this.to,
						subject: this.subject,
						html: data
					}
					this.transporter?.sendMail(mailOptions, (error: any, info: { response: string }) => {
						if (error) {
							console.log(error)
						} else {
							console.log("Email sent: " + info.response)
						}
					})
				}
			}
		}

		ejs.renderFile(this.filePrefix + file, this.variables, mailCallback)
	}
	//endregion
}