const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Manager } = require('erela.js');
const { nodes } = require('../../config.json');
const convertTime = require('../../utils/convertTime');

module.exports = async function (client) {
    client.manager = new Manager({
        nodes,
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })
        .on('nodeConnect', (node) =>
            client.logger.log(`Node ${node.options.identifier} connected`, 'info')
        )
        .on('nodeError', (node, error) =>
            client.logger.log(
                `Node ${node.options.identifier} had an error: ${error.message}`,
                'error'
            )
        )
        .on('nodeDisconnect', (node, reason) => {
            client.logger.log(`Node ${node.options.identifier} disconnected`, 'warn');
        })
        .on('nodeReconnect', (node) =>
            client.logger.log(`Reconnecting node ${node.options.identifier}`, 'log')
        )
        .on('trackStart', async (player, track) => {
            client.logger.log(`NOW PLAYING ${track.title}`, 'music');
            if (player.trackRepeat) return;
            client.musicMsg = await client.channels.cache.get(player.textChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Đang phát ${track.title}`,
                            iconURL:
                                'https://cdn.discordapp.com/attachments/974976339914424382/1038789602930073662/711.gif',
                            url: track.uri,
                        })
                        .setColor('Purple')
                        .addFields([
                            {
                                name: 'Tác giả',
                                value: track.author,
                                inline: true,
                            },
                            {
                                name: 'Thời lượng',
                                value: `${convertTime(track.duration)}`,
                                inline: true,
                            },
                        ])
                        .setThumbnail(
                            `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
                        ),
                ],

                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('music-play/pause')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('⏯️'),

                        new ButtonBuilder()
                            .setCustomId('music-stop')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🛑'),

                        new ButtonBuilder()
                            .setCustomId('music-vol-up')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔊'),

                        new ButtonBuilder()
                            .setCustomId('music-vol-down')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔉'),

                        new ButtonBuilder()
                            .setCustomId('music-repeat')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔁')
                    ),
                ],
            });
        })
        .on('trackEnd', async (player, track, payload) => {
            await client.musicMsg.edit({
                embeds: [EmbedBuilder.from(client.musicMsg.embeds[0])],
                components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setCustomId('music-play/pause')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('⏯️')
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('music-stop')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🛑')
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('music-vol-up')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔊')
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('music-vol-down')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔉')
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('music-repeat')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔁')
                            .setDisabled(true)
                    ),
                ],
            });
        })
        .on('queueEnd', (player) => {
            client.channels.cache.get(player.textChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('Đã hết bài hát để phát, tôi đã thoát khỏi kênh âm thanh!')
                        .setColor('Purple'),
                ],
            });

            player.destroy();
        })
        .on('playerCreate', (player, track) => {
            const guild = client.guilds.cache.get(player.guild);
            client.logger.log(`Created a new player in ${guild.name}`);
        })
        .on('playerDestroy', async (player) => {
            // await client.musicMsg.edit({
            //     embeds: [EmbedBuilder.from(client.musicMsg.embeds[0])],
            //     components: [
            //         new ActionRowBuilder().setComponents(
            //             new ButtonBuilder()
            //                 .setCustomId('music-play/pause')
            //                 .setStyle(ButtonStyle.Primary)
            //                 .setEmoji('⏯️')
            //                 .setDisabled(true),

            //             new ButtonBuilder()
            //                 .setCustomId('music-stop')
            //                 .setStyle(ButtonStyle.Danger)
            //                 .setEmoji('🛑')
            //                 .setDisabled(true),

            //             new ButtonBuilder()
            //                 .setCustomId('music-vol-up')
            //                 .setStyle(ButtonStyle.Primary)
            //                 .setEmoji('🔊')
            //                 .setDisabled(true),

            //             new ButtonBuilder()
            //                 .setCustomId('music-vol-down')
            //                 .setStyle(ButtonStyle.Primary)
            //                 .setEmoji('🔉')
            //                 .setDisabled(true),

            //             new ButtonBuilder()
            //                 .setCustomId('music-repeat')
            //                 .setStyle(ButtonStyle.Primary)
            //                 .setEmoji('🔁')
            //                 .setDisabled(true)
            //         ),
            //     ],
            // });

            const guild = client.guilds.cache.get(player.guild);
            client.logger.log(`Destroyed a player in ${guild.name}`);
        });
    client.on('raw', (d) => {
        client.manager.updateVoiceState(d);
    });
};
