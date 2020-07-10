require("@babel/register")

const server = require("../../src/app").default

module.exports = async () => {
	// @ts-ignore
	global.httpServer = server
	// @ts-ignore
	await global.httpServer.start()
};