const { EmbedBuilder } = require('discord.js');
const convertTime = require('../../utils/convertTime');

module.exports = {
    subCommand: 'music.status',
    description: 'Xem trạng thái của tính năng music',
    catergory: '🎵 Music',
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player)
            return interaction.reply({
                content: `${client.emojisManager.crossmark} Bot hiện đang không có phát nhạc`,
                ephemeral: true,
            });
        const currentNode = client.manager.nodes.first();

        const songs = player.queue;
        let queueList = '';
        let counter = 1;
        for (const song of songs) {
            queueList += `${counter}. ${song.title} [${convertTime(song.duration)}]\n`;
            counter++;
        }
        const queued = queueList.length > 0;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Purple')
                    .setTitle('🎵 Music Status')
                    .setDescription(
                        `
                        > ▶️ **Kênh đang phát nhạc:** <#${player.voiceChannel}>\n
                        > 🗳️ **Server được kết nối:** \`${currentNode.options.host}\`\n
                        > 🎶 **Nhạc đang được phát:** \n${
                            player.playing
                                ? `${player.queue.current.title} ` +
                                  `([Bảng điều khiển](${client.musicMsg.url}))`
                                : 'Không có bài hát được phát'
                        }\n
                        > ⏱️ **Bài hát đã được phát tới:** \`${convertTime(player.position)}\`\n
                        > 🔊 **Âm lượng hiện tại là:** \`${player.volume}\`\n
                        > 📃 **Hàng chờ hiện có:** ${
                            queued ? '\n' + queueList : 'Không có hàng chờ'
                        }
                        `
                    ),
            ],
            ephemeral: true,
        });
    },
};
