const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban thành viên')
        .addUserOption((options) =>
            options.setName('user').setDescription('Thành viên cần ban').setRequired(true)
        )
        .addStringOption((options) =>
            options.setName('reason').setDescription('Lý do ban').setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');
        if (!interaction.guild.members.me.permissions.has('BanMembers'))
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không có quyền ban người dùng!`
            );

        if (target.user.id === client.user.id)
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không thể ban bản thân!`
            );
        if (target.user.id === interaction.user.id)
            return interaction.reply(
                `${client.emojisManager.crossmark} Bạn không thể ban chính mình!`
            );

        let authorHighestRole = interaction.member.roles.highest.position;
        let targetHighestRole = target.roles.highest.position;
        let botHighestRole = interaction.guild.members.me.roles.highest.position;

        if (targetHighestRole >= authorHighestRole)
            return interaction.reply(
                `${client.emojisManager.crossmark} Bạn không thể ban người này vì họ có quyền cao hơn hoặc bằng bạn!`
            );
        if (targetHighestRole >= botHighestRole)
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không thể ban người này vì họ có quyền cao hơn hoặc bằng tôi!`
            );

        const dmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`Bạn đã bị ban ở server ${interaction.guild.name}`)
            .setDescription(
                `${client.emojisManager.ban_hammer} Bạn bị ban bởi <@${interaction.user.id}>`
            )
            .addFields({ name: 'Lý do', value: reason || 'Không có lý do' })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
        const banSuccess = new EmbedBuilder()
            .setColor('Green')
            .setDescription(
                `${client.emojisManager.checkmark} Đã Ban ${target.user.tag} thành công`
            );
        try {
            await target
                .ban({
                    reason: reason || 'Không có lý do',
                })
                .then(() =>
                    interaction.reply({
                        embeds: [banSuccess],
                    })
                );
            target
                .send({
                    embeds: [dmEmbed],
                })
                .catch(() =>
                    interaction.followUp({
                        content: '⚠️ Tôi không thể DM người này được, liệu họ có đóng DM không?',
                        ephemeral: true,
                    })
                );
        } catch (err) {
            Logger.log(err.stack, 'error');
            interaction.reply(`${client.emojisManager.crossmark} Có lỗi xảy ra! \n` + err.message);
        }
    },
};
