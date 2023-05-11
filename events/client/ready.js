const { dev } = require("../../config.json");
const presenceLoop = require("../../utils/presenceLoop");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.manager.init(client.user.id);
        client.logger.log(`Logged in as ${client.user.tag}`, "info");

        try {
            client.logger.log("Refreshing application slash commands...", "warn");

            await client.application.commands.set(client.slashCommand);

            client.logger.log("Application slash commands refreshed.", "info");
        } catch (err) {
            client.logger.log(
                `Error refreshing application slash commands: \n${err.stack}`,
                "error"
            );
        }

        presenceLoop(client);
    },
};
