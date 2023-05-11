const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Guild = require('../../schemas/guild');

module.exports = {
    setup: true,
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('Anti Phishing Setup')
                    .setDescription('Bạn có muốn bật tính năng này không?'),
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('anti-phish-accept')
                        .setLabel('Có')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('anti-phish-deny')
                        .setLabel('Không')
                        .setStyle(ButtonStyle.Danger)
                ),
            ],
            ephemeral: true,
        });

        client.on('interactionCreate', async (i) => {
            const id = i.customId;
            if (!id || !id.includes('anti-phish')) return;
            switch (id) {
                case 'anti-phish-accept': {
                    i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle('Anti Phising Setup')
                                .setDescription('Đã **Bật** Anti Phising'),
                        ],
                        ephemeral: true,
                    });

                    await Guild.findOneAndUpdate(
                        { guildId: interaction.guild.id },
                        { antiphish: true }
                    );

                    break;
                }
                case 'anti-phish-deny': {
                    i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle('Anti Phising Setup')
                                .setDescription('Đã **Tắt** Anti Phising'),
                        ],
                        ephemeral: true,
                    });

                    await Guild.findOneAndUpdate(
                        { guildId: interaction.guild.id },
                        { antiphish: false }
                    );

                    break;
                }
            }

            interaction.editReply({
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('anti-phish-accept')
                            .setLabel('Có')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId('anti-phish-deny')
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
