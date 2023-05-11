const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban một thành viên')
        .addStringOption((options) =>
            options.setName('user').setDescription('ID của thành viên').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        const user = interaction.options.getString('user');

        if (!interaction.guild.members.me.permissions.has('BanMembers'))
            return interaction.reply({
                content: `${client.emojisManager.crossmark} Tôi không có quyền để unban người này, hãy chắc chắn rằng tôi có quyền BAN_MEMBERS`,
                ephemeral: true,
            });

        let bannedList = await interaction.guild.bans.fetch();
        let thisBanned = await bannedList.find((ban) => ban.user.id === user);
        if (!thisBanned)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(
                            `${client.emojisManager.crossmark} Tôi không thể Unban người này hoặc người này chưa bị ban`
                        ),
                ],
                ephemeral: true,
            });

        try {
            let unbanned = await interaction.guild.members.unban(user);

            const unbanSuccess = new EmbedBuilder()
                .setColor('Green')
                .setDescription(
                    `${client.emojisManager.checkmark} Đã unban ${unbanned.tag} thành công`
                );
            interaction.reply({ embeds: [unbanSuccess] });

            const dmEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`Bạn đã được unban ở server ${interaction.guild.name}`)
                .setDescription(`Bạn đã được unban bởi <@${interaction.user.id}>`)
                .setThumbnail(interaction.guild.iconURL())
                .setURL(interaction.channel.createInvite().url);
            unbanned
                .send({ embeds: [dmEmbed] })
                .catch(() =>
                    interaction.followUp(
                        `${client.emojisManager.crossmark} Tôi không thể gửi tin nhắn cho người này`
                    )
                );
        } catch (err) {
            client.logger.log(err.stack, 'error');
            interaction.reply(
                `${client.emojisManager.crossmark} Có lỗi xảy ra khi unban người này`
            );
        }
    },
};
