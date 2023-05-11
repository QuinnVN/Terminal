module.exports = {
    subCommand: 'music.pause',
    description: 'Tạm dừng/Tiếp tục bài hát hiện tại',
    catergory: '🎵 Music',
    async execute(interaction, client) {
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
        if (!player.paused) {
            player.pause(true);
            interaction.reply({
                content: `${client.emojisManager.checkmark} Bài hát đã được tạm dừng`,
                ephemeral: true,
            });
        } else {
            player.pause(false);
            interaction.reply({
                content: `${client.emojisManager.checkmark} Bài hát đã được tiếp tục`,
                ephemeral: true,
            });
        }
    },
};
