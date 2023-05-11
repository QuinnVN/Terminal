const { EmbedBuilder } = require('discord.js');

const axios = require('axios').default;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.guild) return;

        const regex = new RegExp(
            '(?:[A-z0-9](?:[A-z0-9-]{0,61}[A-z0-9])?.)+[A-z0-9][A-z0-9-]{0,61}[A-z0-9]'
        );
        if (regex.test(message.content)) {
            axios
                .post('https://anti-fish.bitflow.dev/check', {
                    message: message.content,
                })
                .then(function (response) {
                    message.delete().catch(() => {});
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Yellow')
                                .setTitle('<:warn:974976348181397525> Phát hiện link nguy hiểm')
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
    },
};
