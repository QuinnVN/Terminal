const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = async function (message) {
    if (!message.guild || message.author.bot) return;

    const regex = new RegExp('^(https:|http:|www.)S*');
    if (regex.test(message.content)) {
        axios
            .post('https://anti-fish.bitflow.dev/check', {
                message: message.content,
            })
            .then(function (response) {
                message.delete().catch(() => {});
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('YELLOW')
                            .setTitle(`⚠️ Phát hiện link nguy hiểm`)
                            .setDescription(
                                `***${response.data.matches[0].domain}*** có thể là link scam nên tôi đã xóa nó đi`
                            )
                            .setFooter({ text: 'Có thể tắt tính năng này qua menu setup' }),
                    ],
                });
            })
            .catch(function (err) {
                return;
            });
    }
};
