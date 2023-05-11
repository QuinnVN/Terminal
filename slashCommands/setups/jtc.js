const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
} = require('discord.js');
const Guild = require('../../schemas/guild');

module.exports = {
    setup: true,
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('Join To Create Setup')
                    .setDescription('Bạn có muốn bật tính năng này không?'),
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('jtc-accept')
                        .setLabel('Có')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('jtc-deny')
                        .setLabel('Không')
                        .setStyle(ButtonStyle.Danger)
                ),
            ],
            ephemeral: true,
        });

        client.on('interactionCreate', async (i) => {
            const id = i.customId;
            if (!id || !id.includes('jtc')) return;
            switch (id) {
                case 'jtc-accept': {
                    i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Black')
                                .setTitle('Join To Create Setup')
                                .setDescription(
                                    'Nhập ID của kênh bạn muốn biến thành kênh join to create \nhoặc nhập `new` để tạo kênh mới'
                                ),
                        ],
                        ephemeral: true,
                    });

                    const filter = (m) => m.author.id === interaction.user.id;

                    i.channel
                        .awaitMessages({ filter, max: 1, time: 30_000 })
                        .then(async (collected) => {
                            const msg = collected.first();
                            msg.delete();
                            if (msg.content == 'new')
                                await interaction.channel.guild.channels
                                    .create({
                                        name: '🔊 Join To Create',
                                        type: ChannelType.GuildCategory,
                                    })
                                    .then((category) => {
                                        interaction.channel.guild.channels
                                            .create({
                                                name: 'Join To Create',
                                                type: ChannelType.GuildVoice,
                                                parent: category,
                                            })
                                            .then(async (channel) => {
                                                await Guild.findOneAndUpdate(
                                                    { guildId: interaction.guild.id },
                                                    { jTC: channel.id }
                                                );

                                                i.followUp({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                            .setColor('Green')
                                                            .setTitle('Join To Create Setup')
                                                            .setDescription(
                                                                'Đã **Bật** Join To Create'
                                                            ),
                                                    ],
                                                    ephemeral: true,
                                                });
                                            });
                                    })
                                    .catch((error) => console.error(error));
                            else if (
                                isNaN(parseInt(msg.content)) ||
                                !interaction.channel.guild.channels.cache.has(msg.content)
                            )
                                return i.followUp({
                                    content: 'ID không hợp lệ',
                                    ephemeral: true,
                                });
                            await Guild.findOneAndUpdate(
                                { guildId: interaction.guild.id },
                                { jTC: msg.content }
                            );

                            i.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Green')
                                        .setTitle('Join To Create Setup')
                                        .setDescription('Đã **Bật** Join To Create'),
                                ],
                                ephemeral: true,
                            });
                        })
                        .catch((collected) => {
                            interaction.followUp({
                                content: 'Bạn đã hết thời gian',
                                ephemeral: true,
                            });
                        });

                    break;
                }
                case 'jtc-deny': {
                    i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle('Join To Create Setup')
                                .setDescription('Đã **Tắt** Join To Create'),
                        ],
                        ephemeral: true,
                    });

                    await Guild.findOneAndUpdate({ guildId: interaction.guild.id }, { jTC: null });

                    break;
                }
            }

            interaction.editReply({
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('jtc-accept')
                            .setLabel('Có')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('jtc-deny')
                            .setLabel('Không')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    ),
                ],
                ephemeral: true,
            });
        });
    },
};
