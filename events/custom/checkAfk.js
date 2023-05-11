const Afk = require('../../schemas/afk');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        let afk = await Afk.findOne({ guildId: message.guild.id, userId: message.author.id });
        if (afk) {
            message.channel.send(`Chào mừng trở lại <@${message.author.id}>!`).then((msg) =>
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 1000 * 10)
            );
            await Afk.findOneAndDelete({ userId: message.author.id, guildId: message.guild.id });
            return;
        }

        for (const user of [...message.mentions.users.values()]) {
            afk = await Afk.findOne({ guildId: message.guild.id, userId: user.id });
            if (afk) {
                message.channel
                    .send(`**${user.username}** đang **Afk** với lời nhắn: ${afk.afk}`)
                    .then((msg) =>
                        setTimeout(() => {
                            msg.delete().catch(() => {});
                        }, 1000 * 10)
                    );
            }
        }
    },
};
