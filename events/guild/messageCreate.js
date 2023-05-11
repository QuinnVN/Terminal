const config = require('../../config');
const { MessageEmbed, Collection } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../schemas/guild.js');
const antiFish = require('../../utils/antiFish');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        let guildProfile = await Guild.findOne({
            guildId: message.guild.id,
        });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: message.guild.id,
            });
            await guildProfile.save().catch((err) => console.error(err));
        }
        return;

        //await checkAfk(message);
        // await antiFish(message);

        const prefix = guildProfile.prefix || config.default.prefix;

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command =
            client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        if (!command.catergory) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply('Bạn không có quyền để thực hiện lệnh này');
            }
        }

        if (command.args && !args.length) {
            let reply = `Bạn chưa thêm bất kỳ giá trị nào cho lệnh, <@${message.author}>!`;

            if (command.usage) {
                reply += `\nCách dùng đúng là: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.reply(reply);
        }

        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    `⏱️ Hãy đợi ${timeLeft.toFixed(1)} giây trước khi dùng lệnh \`${
                        command.name
                    }\`!`
                );
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            //command.execute(client, message, args);
        } catch (err) {
            client.logger.log(err, 'error');
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`ERROR`)
                        .setColor('RED')
                        .setDescription(
                            `Đã có lỗi xảy ra khi thực hiện lệnh \`${command.name}\`: \n\`\`\`${err}\`\`\``
                        ),
                ],
            });
        }
    },
};
