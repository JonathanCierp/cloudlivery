require("@babel/register");

const server = require("../client").client;

module.exports = async () => {
	global.httpServer = server;
	await global.httpServer.listen();
};