const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Hiện thông tin về server'),
    catergory: '🧾 Info',
    async execute(client, interaction) {
        await interaction.guild.members.fetch();
        await interaction.guild.channels.fetch();
        await interaction.guild.roles.fetch();
        const memberCount = await interaction.guild.members.cache.filter(
            (member) => !member.user.bot
        );
        const botCount = await interaction.guild.members.cache.filter((member) => member.user.bot);
        const textChannel = await interaction.guild.channels.cache.filter(
            (channel) => channel.type === ChannelType.GuildText
        );
        const voiceChannel = await interaction.guild.channels.cache.filter(
            (channel) => channel.type === ChannelType.GuildVoice
        );

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`Thông tin của ${interaction.guild.name}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields([
                {
                    name: '🤴 | Owner',
                    value: `<@${interaction.guild.ownerId}>`,
                    inline: true,
                },
                {
                    name: '⏰ | Thời gian tạo',
                    value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: '💡 | Số roles',
                    value: String(interaction.guild.roles.cache.size),
                    inline: true,
                },
                {
                    name: '🧑‍🤝‍🧑 | Tổng số members',
                    value: String(interaction.guild.memberCount),
                    inline: true,
                },
                {
                    name: '🧑 | Tổng số người dùng',
                    value: String(memberCount.size),
                    inline: true,
                },
                {
                    name: '🤖 | Tổng số bot',
                    value: String(botCount.size),
                    inline: true,
                },
                {
                    name: '📚 | Tổng Số Kênh',
                    value: String(interaction.guild.channels.cache.size),
                    inline: true,
                },
                {
                    name: '📖 | Số kênh văn bản',
                    value: String(textChannel.size),
                    inline: true,
                },
                {
                    name: '🔊 | Số kênh âm thanh',
                    value: String(voiceChannel.size),
                    inline: true,
                },
            ]);
        interaction.reply({ embeds: [embed] });
    },
};
