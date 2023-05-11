const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios').default;
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('Tìm kiếm trên google')
        .addStringOption((options) =>
            options.setName('keyword').setDescription('Từ khóa').setRequired(true)
        ),
    catergory: '🧰 Utility',
    async execute(client, interaction) {
        const keyword = interaction.options.getString('keyword');

        await interaction.reply({
            content: '🔎 Đang tìm kiếm...',
            ephemeral: true,
        });


        const result = await axios
            .get('https://customsearch.googleapis.com/customsearch/v1', {
                params: {
                    q: keyword,
                    cx: config.google.engineID,
                    key: config.google.apiKey,
                },
            })
            .catch(() => {});

        if (!result || !result.data.items)
            return interaction.editReply(
                `${client.emojisManager.crossmark} Không có kết quả cho \`${keyword}\``
            );

        if (result.status >= 400)
            return interaction
                .editReply(
                    `${client.emojisManager.crossmark} Đã có lỗi khi tìm kiếm, vui lòng thử lại sau. Lỗi là: \`${result.message}\``
                )
                .then(() => console.log(result.message));

        const res = result.data.items[0];
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(res.title)
            .setDescription(res.snippet)
            .setURL(res.link);
        if (res.pagemap.cse_image || res.pagemap.cse_thumbnail)
            embed.setImage(res.pagemap.cse_image[0].src || res.pagemap.cse_thumbnail[0].src);

        interaction.editReply({
            content: `${client.emojisManager.checkmark} Đã tìm thấy`,
        });
        interaction.channel.send({ embeds: [embed] });
    },
};
