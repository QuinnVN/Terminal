const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Xóa tin nhắn')
        .addIntegerOption((options) =>
            options.setName('amount').setDescription('Số lượng tin nhắn').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    catergory: '🔨 Moderation',
    execute(client, interaction) {
        if (!interaction.guild.members.me.permissions.has('ManageMessages'))
            return interaction.reply({
                content: `${client.emojisManager.crossmark} Tôi không có quyền để xóa tin nhắn, hãy chắc chắn rằng tôi có quyền \`MANAGE_MESSAGES\``,
                ephemeral: true,
            });

        const amount = interaction.options.getInteger('amount');
        if (amount < 1) return interaction.reply('Bạn không thể xóa ít hơn 1 tin nhắn!');
        try {
            interaction.channel.bulkDelete(amount);
            interaction.reply({
                content: `${client.emojisManager.checkmark} Đã xóa thành công!`,
                ephemeral: true,
            });
        } catch (error) {
            interaction.reply({
                content: `${client.emojisManager.crossmark} Có lỗi xảy ra khi xóa 1 số tin nhắn...(có thể vì những tin nhắn đó đã được gửi quá lâu)`,
                ephemeral: true,
            });
        }
    },
};
