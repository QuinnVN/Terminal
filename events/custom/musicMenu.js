module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return;
        const opt = interaction.customId.split('-');
        if (!opt[0] === 'music') return;
        switch (opt[1]) {
            case 'play/pause': {
                if (
                    !interaction.member.voice.channel ||
                    !interaction.member.voice.channel.id === player.voiceChannel
                )
                    return i.reply({
                        content: `${client.musicMsg.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
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
                break;
            }

            case 'vol': {
                if (
                    !interaction.member.voice.channel ||
                    !interaction.member.voice.channel.id === player.voiceChannel
                )
                    return interaction.reply({
                        content: `${client.musicMsg.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
                        ephemeral: true,
                    });
                let vol = player.volume;
                if (opt[2] === 'up') {
                    vol += 10;
                } else {
                    if (vol == 0) {
                        interaction.reply({
                            content: `${client.musicMsg.crossmark} Âm lượng không được ở dưới 0%`,
                            ephemeral: true,
                        });
                        break;
                    }
                    vol -= 10;
                }

                player.setVolume(vol);

                interaction.reply({
                    content: `${client.emojisManager.checkmark} Âm lượng đã được đặt ở mức ${vol}%`,
                    ephemeral: true,
                });

                break;
            }

            case 'repeat': {
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

            case 'stop': {
                if (
                    !interaction.member.voice.channel ||
                    !interaction.member.voice.channel.id === player.voiceChannel
                )
                    return interaction.reply({
                        content: `${client.musicMsg.crossmark} Bạn cần phải ở trong 1 kênh âm thanh để thực hiện lệnh này`,
                        ephemeral: true,
                    });

                player.stop();
                player.queue.clear();

                await interaction.deferUpdate();
            }
        }
    },
};
