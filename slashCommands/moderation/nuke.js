const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Xóa toàn bộ tin nhắn trong kênh hiện tại')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    catergory: '🔨 Moderation',
    async execute(client, interaction) {
        const nukeChannel = interaction.channel;

        const confirm = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('Nuke kênh này?')
                    .setDescription(
                        `${client.emojisManager.nuke} Bạn có chắc rằng bạn muốn nuke kênh này?\nBấm nút \`confirm\` trong vòng 20s để tiếp tục`
                    ),
            ],
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setLabel('Confirm')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('confirm-nuke')
                ),
            ],
        });

        const collector = confirm.createMessageComponentCollector({
            max: 1,
            time: 20000,
        });

        collector.on('collect', async (i) => {
            if (!i.user.id === interaction.user.id) return;
            collector.stop();
            nukeChannel
                .clone()
                .then((channel) => channel.setPosition(nukeChannel.position))
                .catch(() =>
                    interaction.reply(`${client.emojisManager.crossmark} Đã có lỗi xảy ra...`)
                );
            nukeChannel.delete().catch(() => {});
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                interaction
                    .editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('Đã Hủy')
                                .setDescription(
                                    '⚠️ Yêu cầu nuke của bạn đã bị hủy do hết thời gian'
                                ),
                        ],
                        components: [
                            new ActionRowBuilder().setComponents(
                                new ButtonBuilder()
                                    .setLabel('Confirm')
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId('confirm-nuke')
                                    .setDisabled(true)
                            ),
                        ],
                    })
                    .then((msg) =>
                        setTimeout(() => {
                            msg.delete();
                        }, 20000)
                    );
            }
        });
    },
};
