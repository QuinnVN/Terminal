const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Hiện tin nhắn đã bị xóa gần đây nhất')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        const msg = client.snipes.get(interaction.channelId);
        if (!msg)
            return interaction.reply(`${client.emojisManager.crossmark} Không tìm thấy tin nhắn này!`);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setAuthor({
                name: `Người gửi: ${msg.author.tag}`,
                iconURL: msg.author.displayAvatarURL(),
            })
            .setDescription(msg.content);
        if (msg.image) embed.setImage(msg.image);
        interaction.reply({ embeds: [embed] });
    },
};
