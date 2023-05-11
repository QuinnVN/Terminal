const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
    catergory: '🧾 Info',
    async execute(client, interaction) {
        const message = await interaction.deferReply({ fetchReply: true });
        const ping = message.createdTimestamp - interaction.createdTimestamp;
        const APIPing = Math.floor(client.ws.ping);
        const pingEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({
                name: `Đây Là Ping của tôi`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(
                `${
                    ping < 100
                        ? client.emojisManager.ping_low
                        : ping < 500
                        ? client.emojisManager.ping_medium
                        : client.emojisManager.ping_high
                } Bot Ping: \`${ping}ms\`\n\n${
                    APIPing < 100
                        ? client.emojisManager.ping_low
                        : APIPing < 500
                        ? client.emojisManager.ping_medium
                        : client.emojisManager.ping_high
                } API Ping: \`${APIPing}ms\``
            );
        interaction.editReply({
            embeds: [pingEmbed],
        });
    },
};
