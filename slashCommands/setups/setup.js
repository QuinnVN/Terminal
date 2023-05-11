const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    SelectMenuBuilder,
    ActionRowBuilder,
} = require('discord.js');
const Guild = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup các chức năng đặt biệt')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    catergory: '⚙️ Setup',
    async execute(client, interaction) {
        const guild = await Guild.findOne({ guildId: interaction.guild.id });

        let Jtc = '';
        let antiphish = false;

        if (guild.jTC) {
            Jtc = `> Channel ID: <#${guild.jTC}>`;
        } else {
            Jtc = 'Chưa cài đặt';
        }

        if (guild.antiphish) {
            antiphish = true;
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('LightGrey')
                    .setTitle('⚙️ Setup Menu')
                    .setDescription(`Đây là cài đặt của ${interaction.guild.name}`)
                    .addFields([
                        {
                            name: 'Join To Create',
                            value: Jtc,
                        },
                        {
                            name: 'Anti Phishing',
                            value: `${antiphish ? '✅' : '<:CrossMark:962325384764989460> '}`,
                        },
                    ]),
            ],

            components: [
                new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('setup-menu')
                        .setPlaceholder('Click để lựa chọn')
                        .addOptions(
                            {
                                label: 'Join To Create',
                                description: 'Setup Join To Create',
                                value: 'jtc',
                                emoji: '🔊',
                            },
                            {
                                label: 'Anti Phishing',
                                description: 'Setup Anti Phishing',
                                value: 'antiphish',
                                emoji: '🎣',
                            }
                        )
                ),
            ],
        });
    },
};
