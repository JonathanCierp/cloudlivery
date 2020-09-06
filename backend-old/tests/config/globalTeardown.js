//globalTeardown.js
module.exports = async () => {
	await global.httpServer.stop();
};