module.exports = {
    subCommand: 'music.skip',
    description: 'Bỏ qua bài hát hiện tại',
    catergory: '🎵 Music',
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player)
            return interaction.reply({
                content: `${client.musicMsg.crossmark} Không có bài hát nào được bật`,
                ephemeral: true,
            });
        if (
            !interaction.member.voice.channel ||
            !interaction.member.voice.channel.id === player.voiceChannel
        )
            return i.reply({
                content: `${client.musicMsg.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
                ephemeral: true,
            });

        player.stop();

        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
