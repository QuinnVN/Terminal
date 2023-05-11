module.exports = {
    subCommand: 'music.repeat',
    description: 'Lặp lại các bài hát/danh sách hiện tại trong danh sách chờ',
    catergory: '🎵 Music',
    async execute(interaction, client) {
        const type = interaction.options.getString('type');
        const player = client.manager.players.get(interaction.guild.id);

        if (!player)
            return interaction.reply(`${client.musicMsg.crossmark} Không có bài hát nào được bật`);
        if (
            !interaction.member.voice.channel ||
            !interaction.member.voice.channel.id === player.voiceChannel
        )
            return i.reply({
                content: `${client.musicMsg.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
                ephemeral: true,
            });

        switch (type) {
            case 'song': {
                if (!player.trackRepeat) {
                    interaction.reply({
                        content: `${client.emojisManager.checkmark} Bài hát hiện tại sẽ lặp lại cho tới khi bạn sử dụng lệnh stop!`,
                        ephemeral: true,
                    });
                    player.setTrackRepeat(true);
                } else {
                    interaction.reply({
                        content: `${client.emojisManager.checkmark} Bài hát hiện tại sẽ chỉ phát 1 lần kể từ bây giờ!`,
                        ephemeral: true,
                    });
                    player.setTrackRepeat(false);
                }
                break;
            }

            case 'list': {
                if (!player.queueRepeat) {
                    interaction.reply({
                        content: `${client.emojisManager.checkmark} Tất cả bài hát trong hàng chờ sẽ lặp lại cho tới khi bạn sử dụng lệnh stop!`,
                        ephemeral: true,
                    });
                    player.setQueueRepeat(true);
                } else {
                    interaction.reply({
                        content: `${client.emojisManager.checkmark} Tất cả bài hát trong hàng chờ sẽ chỉ phát 1 lần kể từ bây giờ!`,
                        ephemeral: true,
                    });
                    player.setQueueRepeat(false);
                }
                break;
            }
        }
    },
};
