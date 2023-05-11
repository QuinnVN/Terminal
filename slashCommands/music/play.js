const { EmbedBuilder } = require('discord.js');
const convertTime = require('../../utils/convertTime');

module.exports = {
    subCommand: 'music.play',
    description: 'Phát 1 bài hát',
    catergory: '🎵 Music',
    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused();
        try {
            const res = await client.manager.search(focused, interaction.author);
            const tracks = res.tracks.slice(0, 10);

            const result = await tracks.map((track) => ({
                name: track.title,
                value: track.title,
            }));

            await interaction.respond(result);
        } catch (err) {
            console.error(err);
        }
    },
    async execute(interaction, client) {
        const song = interaction.options.getString('song');

        if (!interaction.member.voice.channel)
            interaction.reply({
                content: `${client.musicMsg.crossmark} Bạn phải ở trong 1 kênh voice để sử dụng lệnh này`,
                ephemeral: true,
            });

        // Retrieves tracks with your query and the requester of the tracks.
        // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
        // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
        const res = await client.manager.search(song, interaction.member);

        // Create a new player. This will return the player if it already exists.
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            volume: 30,
            selfDeafen: true,
        });

        // Connect to the voice channel.
        player.connect();

        // Adds the first track to the queue.
        player.queue.add(res.tracks[0]);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Purple')
                    .setDescription(
                        `${client.emojisManager.checkmark} Đã thêm **${res.tracks[0].title}** vào hàng chờ`
                    ),
            ],
        });

        // Plays the player (plays the first track in the queue).
        // The if statement is needed else it will play the current track again
        if (!player.playing && !player.paused && !player.queue.size) player.play();

        // For playlists you'll have to use slightly different if statement
        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
            player.play();
    },
};
