const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Đuổi người dùng ra khỏi server')
        .addUserOption((options) =>
            options.setName('user').setDescription('Người dùng cần đuổi').setRequired(true)
        )
        .addStringOption((options) =>
            options.setName('reason').setDescription('Lý do đuổi').setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        if (!interaction.guild.members.me.permissions.has('KickMembers'))
            return interaction.reply({
                content:
                    `${client.emojisManager.crossmark} Tôi không có quyền để kick người này, hãy chắc chắn rằng tôi có quyền \`KICK_MEMBERS\``,
                ephemeral: true,
            });

        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');
        if (!interaction.guild.members.me.permissions.has('KickMembers'))
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không có quyền kick người dùng!`
            );

        if (!interaction.guild.members.cache.get(target.id))
            return interaction.reply(
                `${client.emojisManager.crossmark} Không tìm thấy người dùng!`
            );
        if (target.user.id === client.user.id)
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không thể kick bản thân!`
            );
        if (target.user.id === interaction.user.id)
            return interaction.reply(
                `${client.emojisManager.crossmark} Bạn không thể kick chính mình!`
            );

        let authorHighestRole = interaction.member.roles.highest.position;
        let targetHighestRole = target.roles.highest.position;
        let botHighestRole = interaction.guild.me.roles.highest.position;

        if (targetHighestRole >= authorHighestRole)
            return interaction.reply(
                `${client.emojisManager.crossmark} Bạn không thể kick người này vì họ có quyền cao hơn hoặc bằng bạn!`
            );
        if (targetHighestRole >= botHighestRole)
            return interaction.reply(
                `${client.emojisManager.crossmark} Tôi không thể kick người này vì họ có quyền cao hơn hoặc bằng tôi!`
            );

        const dmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`Bạn đã bị kick ở server ${interaction.guild.name}`)
            .setDescription(`Bạn bị kick bởi <@${interaction.user.id}>`)
            .addField('Lý do', reason)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
        const kickSuccess = new EmbedBuilder()
            .setColor('Green')
            .setDescription(
                `${client.emojisManager.checkmark} Đã kick ${target.user.tag} thành công`
            );
        try {
            await target
                .kick({
                    reason: reason,
                })
                .then(() =>
                    interaction.reply({
                        embeds: [kickSuccess],
                    })
                );
            target
                .send({
                    embeds: [dmEmbed],
                })
                .catch(() =>
                    interaction.followUp({
                        content:
                            '⚠️ Tôi không thể DM người này được, liệu họ có đóng DM không?',
                        ephemeral: true,
                    })
                );
        } catch (err) {
            Logger.log(err.stack, 'error');
            interaction.reply(
                `${client.emojisManager.crossmark} Có lỗi xảy ra! \n` + err.interaction
            );
        }
    },
};
