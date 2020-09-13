const fs = require("fs")
import { Logger, LoggerService } from "@nestjs/common"

export class AppLogger extends Logger implements LoggerService {
	constructor(logLevel: number = 0) {
		super()
		this.logLevel = logLevel
	}

	/**
	 * loglevel = 0 --> All outputs
	 * loglevel = 1 --> Error and warns outputs
	 * loglevel = 2 --> Error outputs
	 */
	logLevel: number = 0

	log(message: string, scope: string = "APP") {
		super.log(message)
		this.writeLogInFile(message, scope, "LOG")
	}

	error(message: string, scope: string = "APP") {
		super.error(message)
		this.writeLogInFile(message, scope, "ERROR")
	}

	warn(message: string, scope: string = "APP") {
		super.warn(message)
		this.writeLogInFile(message, scope, "WARN")
	}

	debug(message: string, scope: string = "APP") {
		super.debug(message)
		this.writeLogInFile(message, scope, "DEBUG")
	}

	verbose(message: string, scope: string = "APP") {
		super.verbose(message)
		this.writeLogInFile(message, scope, "VERBOSE")
	}

	writeLogInFile(message: string, scope: string = "APP", type: string = "LOG", path: string = "storage/logs") {
		const now: Date = new Date()
		const year = now.getFullYear()
		const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
		const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
		const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
		const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
		const seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()
		const filePath = `${path}/log-${year}-${month}-${day}.log`
		const date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		const fullMessage = `[${type}]  [${scope}]  ${date}  -  ${message}\n`

		if (this.logLevel === 0) {
			this.writeFile(filePath, fullMessage)
		} else if (this.logLevel === 1 && ["ERROR", "WARN"].indexOf(type) !== -1) {
			this.writeFile(filePath, fullMessage)
		} else if (this.logLevel === 2 && ["ERROR"].indexOf(type) !== -1) {
			this.writeFile(filePath, fullMessage)
		}
	}

	writeFile(filePath: string, fullMessage: string) {
		fs.appendFile(filePath, fullMessage, function (err) {
			if (err) throw err
		})
	}
}