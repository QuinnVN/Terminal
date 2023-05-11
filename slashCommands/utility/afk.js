const { SlashCommandBuilder } = require('discord.js');
const Afk = require('../../schemas/afk');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Đặt status AFK')
        .addStringOption((options) =>
            options.setName('message').setDescription('Lời nhắn AFK').setRequired(false)
        ),
    catergory: '🧰 Utility',
    async execute(client, interaction) {
        const afkMsg = interaction.options.getString('message') || 'AFK';

        await new Afk({
            _id: mongoose.Types.ObjectId(),
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            afk: afkMsg,
        }).save();
        interaction.reply(`**Bạn đã bật chế độ AFK với lời nhắn:** ${afkMsg}`);
    },
};
