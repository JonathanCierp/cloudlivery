const nodemailer = require("nodemailer")
const ejs = require("ejs")

function send(to: string, subject: string, file: string) {
	const transporter = nodemailer.createTransport({
		host: process.env.NODE_MAILER_TRANSPORT_HOST,
		port: process.env.NODE_MAILER_TRANSPORT_PORT,
		auth: {
			user: process.env.NODE_MAILER_TRANSPORT_USER,
			pass: process.env.NODE_MAILER_TRANSPORT_PASS
		}
	})

	//Verifying the Nodemailer Transport instance
	transporter.verify((error: any, success: any) => {
		if (error) {
			console.log(error)
		} else {
			console.log("Server is ready to take messages")
		}
	})

	ejs.renderFile(__dirname + "/templates/" + file, { name: "Jonathan" }, (err: any, data: any) => {
		if (err) {
			console.log(err)
		} else {
			const mailOptions = {
				from: process.env.NODE_MAILER_OPTION_FROM,
				to,
				subject,
				html: data
			}

			transporter.sendMail(mailOptions, (error: any, info: { response: string }) => {
				if (error) {
					console.log(error)
				} else {
					console.log("Email sent: " + info.response)
				}
			})
		}
	})
}

export const mail = {
	send
}