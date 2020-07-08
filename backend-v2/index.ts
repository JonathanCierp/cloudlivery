import server from "./src/app";

server.start(() =>
	console.log(
		`🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
	)
).then(r => {})