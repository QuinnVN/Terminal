const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music Commands')
        .addSubcommand((subCommand) =>
            subCommand
                .setName('play')
                .setDescription('Phát 1 bài hát')
                .addStringOption((options) =>
                    options
                        .setName('song')
                        .setDescription('Tên hoặc link tới bài hát')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('stop').setDescription('Dừng bài hát hiện tại')
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('skip').setDescription('Bỏ qua bài hát hiện tại')
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('repeat')
                .setDescription('Lặp lại các bài hát/danh sách hiện tại trong danh sách chờ')
                .addStringOption((options) =>
                    options
                        .setName('type')
                        .setDescription('Loại')
                        .setChoices(
                            { name: 'Song', value: 'song' },
                            { name: 'Playlist', value: 'list' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('pause').setDescription('Tạm dừng/Tiếp tục bài hát hiện tại')
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('volume')
                .setDescription('Đặt âm lượng')
                .addIntegerOption((options) =>
                    options.setName('volume').setDescription('Âm lượng (0-150%)').setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('status').setDescription('Xem trạng thái của tính năng music')
        ),
    catergory: '🎵 Music',
};
