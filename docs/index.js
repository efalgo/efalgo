const dns = require("node:dns");
const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const serveHandler = require("serve-handler");
const server = https.createServer(
	{
		cert: fs.readFileSync("tmp/fullchain.pem"),
		key: fs.readFileSync("tmp/privkey.pem"),
	},
	(request, response) => {
		return serveHandler(request, response);
	},
);
if (process.env.STAGE) {
	server.listen(443, "0.0.0.0", () => {
		dns.lookup(os.hostname(), (err, address) => {
			console.log(`Container IP address: https://${address}`);
		});
		process.on("SIGINT", () => {
			process.exit(0);
		});
	});
}
