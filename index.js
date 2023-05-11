// Require the necessary js classes
const { Collection, Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const { bot } = require("./config.json");

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.User,
        Partials.GuildMember,
        Partials.ThreadMember,
    ],
    presence: {
        activities: [
            {
                name: `/help | Terminal v2.1`,
                type: ActivityType.Playing,
            },
        ],
    },
});

client.slashCommands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.snipes = new Collection();
client.subCommands = new Collection();
client.logger = require("./utils/logger");
client.emojisManager = require("./assets/emojis.json");

const functionsFolders = fs.readdirSync("./functions");
for (const folder of functionsFolders) {
    const functionFiles = fs
        .readdirSync(`./functions/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}
// Login to with your Discord client's token
client.login(bot.token);
