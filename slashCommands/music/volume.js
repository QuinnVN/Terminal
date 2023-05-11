module.exports = {
    subCommand: 'music.volume',
    description: 'Đặt âm lượng',
    catergory: '🎵 Music',
    async execute(interaction, client) {
        const volume = interaction.options.getInteger('volume');
        const player = client.manager.players.get(interaction.guild.id);

        if (!player)
            return interaction.reply({
                content: `${client.emojisManager.crossmark} Không có bài hát nào được bật`,
                ephemeral: true,
            });
        if (
            !interaction.member.voice.channel ||
            !interaction.member.voice.channel.id === player.voiceChannel
        )
            return i.reply({
                content: `${client.emojisManager.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
                ephemeral: true,
            });

        if (0 > parseInt(volume) || parseInt(volume) > 150)
            return interaction.reply({
                content: `${client.emojisManager.crossmark} Âm lượng bạn vừa nhập không hợp lệ, hãy chắc chắn rằng âm lượng là 1 con số và từ 0 - 150`,
                ephemeral: true,
            });

        player.setVolume(parseInt(volume));

        interaction.reply({
            content: `${client.emojisManager.checkmark} Âm lượng đã được đặt ở mức ${volume}%`,
            ephemeral: true,
        });
    },
};
