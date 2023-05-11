const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Một cách mute hoàn toàn mới')
        .addUserOption((options) =>
            options.setName('user').setDescription('User bạn muốn timeout').setRequired(true)
        )
        .addStringOption((options) =>
            options.setName('time').setDescription('Thời gian timeout (1m,1h,1d)').setRequired(true)
        )
        .addStringOption((options) =>
            options.setName('reason').setDescription('lý do timeout').setMaxLength(512)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        await interaction.deferReply();
        const user = interaction.options.getMember('user');
        const time = interaction.options.geString('time');
        const reason = interaction.options.geString('reason') || 'No reason specified';

        if (!user)
            return interaction.editReply({
                content: `${client.emojisManager.crossmark} Lỗi, không tìm thấy người dùng`,
                ephemeral: true,
            });

        if (!ms(time) || ms(time) > ms('28d'))
            return interaction.editReply({
                content: `${client.emojisManager.crossmark} Lỗi, thời gian không hợp lệ`,
                ephemeral: true,
            });

        if (!user.manageble || !user.moderateble)
            return interaction.editReply({
                content: `${client.emojisManager.crossmark} Lỗi, người dùng này không được quản lý bởi tôi`,
                ephemeral: true,
            });

        if (interaction.member.roles.highest.position < user.roles.highest.position)
            return interaction.editReply({
                content: `${client.emojisManager.crossmark} Người này có role cao hơn bạn!`,
                ephemeral: true,
            });

        user.timeout(ms(time), reason).then(() => {
            interaction
                .editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(
                                `${client.emojisManager.checkmark} ${user.user.tag} đã bị timeout`
                            ),
                    ],
                })
                .catch((err) => {
                    interaction.editReply({
                        content: `${client.emojisManager.crossmark} Đã có lỗi xảy ra, vui lòng thử lại`,
                        ephemeral: true,
                    });
                });
        });
    },
};
