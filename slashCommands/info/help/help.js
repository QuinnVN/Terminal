const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuBuilder,
    EmbedBuilder,
} = require('discord.js');
const cmdCatergories = require('./catergories.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiện thông tin về tất cả lệnh của bot')
        .addStringOption((options) =>
            options.setName('command').setDescription('Tên của lệnh').setRequired(false)
        ),
    catergory: '🧾 Info',
    async execute(client, interaction) {
        if (!interaction.options.getString('command')) {
            const catergories = cmdCatergories.map((catergory) => ({
                label: catergory.name,
                description: catergory.des,
                value: catergory.value,
                emoji: catergory.emoji,
            }));

            const homePage = new EmbedBuilder()
                .setColor('White')
                .setTitle('Help Menu')
                .setDescription(
                    `Tôi có tổng cộng là \`${
                        client.slashCommands.filter((cmd) => cmd.execute && cmd.catergory).size +
                        client.subCommands.size
                    }\` lệnh
                        
                            ❓ __Cách sử dụng menu__:
                            > 1.Dùng 3 nút bên dưới để chuyển giữa các trang
                            > 2.Dùng menu thả xuống để chọn trang cần tới
                            
                            📖 __Các chức năng của bot__:
                            > Quản lý người dùng/server (Moderation)
                            > Phát nhạc (Music)
                            > Một số lệnh hữu ích đối với developers 
                            > Một số lệnh hữu dụng trong đời sống (Utility)`
                )
                .setFooter({ text: `Trang 1/${cmdCatergories.length + 1}` });

            const pages = [homePage];
            let i = 2;
            cmdCatergories.forEach((catergory) => {
                const commands = client.slashCommands.filter(
                    (cmd) =>
                        cmd.execute &&
                        cmd.catergory &&
                        cmd.catergory === catergory.emoji + ' ' + catergory.name
                );
                const subCommands = client.subCommands.filter(
                    (cmd) =>
                        cmd.execute &&
                        cmd.catergory &&
                        cmd.catergory === catergory.emoji + ' ' + catergory.name
                );
                let cmds = '';
                commands.forEach((cmd) => {
                    if (commands.last() === cmd) return (cmds += `\`/${cmd.data.name}\``);
                    cmds += `\`/${cmd.data.name}\`, `;
                });
                subCommands.forEach((cmd) => {
                    if (subCommands.last() === cmd)
                        return (cmds += `\`/${cmd.subCommand.split('.').join(' ')}\``);
                    cmds += `\`/${cmd.subCommand.split('.').join(' ')}\`, `;
                });
                pages.push(
                    new EmbedBuilder()
                        .setColor('White')
                        .setTitle(catergory.emoji + ' ' + catergory.name)
                        .setDescription(`**Có các lệnh sau:**\n ${cmds}`)
                        .setFooter({ text: `Trang ${i}/${cmdCatergories.length + 1}` })
                );
                i++;
            });

            const menu = await interaction.reply({
                embeds: [pages[0]],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('<')
                            .setCustomId('help-back')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel('🏠')
                            .setCustomId('help-home')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setLabel('>')
                            .setCustomId('help-forward')
                            .setStyle(ButtonStyle.Primary)
                    ),
                    new ActionRowBuilder().addComponents(
                        new SelectMenuBuilder()
                            .setPlaceholder('----Chọn loại lệnh----')
                            .setCustomId('help-menu')
                            .setOptions(...catergories)
                    ),
                ],
                fetchReply: true,
            });

            const collector = await menu.createMessageComponentCollector({
                time: 300000, //5p
            });

            let selected = 0;
            collector.on('collect', (i) => {
                if (i.user.id !== interaction.user.id)
                    return i.reply({
                        content: `${client.emojisManager.crossmark} Bạn không có quyền sử dụng menu này`,
                        ephemeral: true,
                    });
                i.deferUpdate();
                if (i.isButton()) {
                    const index = selected;
                    switch (i.customId) {
                        case 'help-back': {
                            if (index - 1 === 0) {
                                menu.edit({
                                    embeds: [pages[index - 1]],
                                    components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setLabel('<')
                                                .setCustomId('help-back')
                                                .setStyle(ButtonStyle.Primary)
                                                .setDisabled(true),
                                            new ButtonBuilder()
                                                .setLabel('🏠')
                                                .setCustomId('help-home')
                                                .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                                .setLabel('>')
                                                .setCustomId('help-forward')
                                                .setStyle(ButtonStyle.Primary)
                                        ),
                                        new ActionRowBuilder().addComponents(
                                            new SelectMenuBuilder()
                                                .setPlaceholder('----Chọn loại lệnh----')
                                                .setCustomId('help-menu')
                                                .setOptions(...catergories)
                                        ),
                                    ],
                                    fetchReply: true,
                                });
                            } else {
                                menu.edit({
                                    embeds: [pages[index - 1]],
                                    components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setLabel('<')
                                                .setCustomId('help-back')
                                                .setStyle(ButtonStyle.Primary),
                                            new ButtonBuilder()
                                                .setLabel('🏠')
                                                .setCustomId('help-home')
                                                .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                                .setLabel('>')
                                                .setCustomId('help-forward')
                                                .setStyle(ButtonStyle.Primary)
                                        ),
                                        new ActionRowBuilder().addComponents(
                                            new SelectMenuBuilder()
                                                .setPlaceholder('----Chọn loại lệnh----')
                                                .setCustomId('help-menu')
                                                .setOptions(...catergories)
                                        ),
                                    ],
                                });
                            }
                            selected = index - 1;
                            break;
                        }
                        case 'help-forward': {
                            if (index + 1 === pages.length - 1) {
                                menu.edit({
                                    embeds: [pages[index + 1]],
                                    components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setLabel('<')
                                                .setCustomId('help-back')
                                                .setStyle(ButtonStyle.Primary),
                                            new ButtonBuilder()
                                                .setLabel('🏠')
                                                .setCustomId('help-home')
                                                .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                                .setLabel('>')
                                                .setCustomId('help-forward')
                                                .setStyle(ButtonStyle.Primary)
                                                .setDisabled(true)
                                        ),
                                        new ActionRowBuilder().addComponents(
                                            new SelectMenuBuilder()
                                                .setPlaceholder('----Chọn loại lệnh----')
                                                .setCustomId('help-menu')
                                                .setOptions(...catergories)
                                        ),
                                    ],
                                    fetchReply: true,
                                });
                            } else {
                                menu.edit({
                                    embeds: [pages[index + 1]],
                                    components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setLabel('<')
                                                .setCustomId('help-back')
                                                .setStyle(ButtonStyle.Primary),
                                            new ButtonBuilder()
                                                .setLabel('🏠')
                                                .setCustomId('help-home')
                                                .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                                .setLabel('>')
                                                .setCustomId('help-forward')
                                                .setStyle(ButtonStyle.Primary)
                                        ),
                                        new ActionRowBuilder().addComponents(
                                            new SelectMenuBuilder()
                                                .setPlaceholder('----Chọn loại lệnh----')
                                                .setCustomId('help-menu')
                                                .setOptions(...catergories)
                                        ),
                                    ],
                                    fetchReply: true,
                                });
                            }
                            selected = index + 1;
                            break;
                        }
                        case 'help-home': {
                            menu.edit({
                                embeds: [pages[0]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(true),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 0;
                            break;
                        }
                    }
                } else {
                    switch (i.values[0]) {
                        case 'developers': {
                            menu.edit({
                                embeds: [pages[1]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 1;
                            break;
                        }
                        case 'info': {
                            menu.edit({
                                embeds: [pages[2]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 2;
                            break;
                        }
                        case 'mod': {
                            menu.edit({
                                embeds: [pages[3]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 3;
                            break;
                        }
                        case 'music': {
                            menu.edit({
                                embeds: [pages[4]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 4;
                            break;
                        }
                        case 'setup': {
                            menu.edit({
                                embeds: [pages[5]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 5;
                            break;
                        }
                        case 'utility': {
                            menu.edit({
                                embeds: [pages[6]],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setLabel('<')
                                            .setCustomId('help-back')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setLabel('🏠')
                                            .setCustomId('help-home')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel('>')
                                            .setCustomId('help-forward')
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(true)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new SelectMenuBuilder()
                                            .setPlaceholder('----Chọn loại lệnh----')
                                            .setCustomId('help-menu')
                                            .setOptions(...catergories)
                                    ),
                                ],
                                fetchReply: true,
                            });
                            selected = 6;
                            break;
                        }
                    }
                }

                collector.resetTimer();
            });

            collector.on('end', () =>
                interaction.editReply({
                    content:
                        '⚠ Đã hết thời gian xem, vui lòng gọi lệnh lại 1 lần nữa để tiếp tục xem',
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setLabel('<')
                                .setCustomId('help-back')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setLabel('🏠')
                                .setCustomId('help-home')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setLabel('>')
                                .setCustomId('help-forward')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new SelectMenuBuilder()
                                .setPlaceholder('----Chọn loại lệnh----')
                                .setCustomId('help-menu')
                                .setOptions(...catergories)
                                .setDisabled(true)
                        ),
                    ],
                })
            );
        } else {
            let cmd = interaction.options.getString('command');
            cmd = cmd.split(' ');
            cmd =
                cmd.length === 1
                    ? client.slashCommands.get(cmd[0])
                    : client.subCommands.get(cmd.join('.'));
            if (!cmd)
                return interaction.reply({
                    content: `${client.emojisManager.crossmark}Không tìm thấy lệnh này!`,
                    ephemeral: true,
                });

            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle('Help Menu')
                .setFields(
                    {
                        name: '📃 Loại lệnh',
                        value: cmd.catergory,
                    },
                    {
                        name: '📝 Tên của lệnh (Cách gõ lệnh)',
                        value: cmd.data
                            ? `\`/${cmd.data.name}\``
                            : `\`/${cmd.subCommand.split('.').join(' ')}\``,
                    },
                    {
                        name: '📖 Mô tả lệnh',
                        value: cmd.data ? cmd.data.description : cmd.description,
                    }
                );

            interaction.reply({ embeds: [embed] });
        }
    },
};
