const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { dependencies } = require('../../package.json');
const chalk = require('chalk');
const ms = require('ms')
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder().setName('terminal').setDescription('Thông tin của bot'),
    catergory: '🧾 Info',
    async execute(client, interaction) {
        client.guilds.fetch();
        const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        interaction.reply(
            codeBlock(
                'ansi',
                chalk.bgGrey(
                    chalk.white(figlet.textSync('Terminal')) +
                    '\nX:/Users/Terminal> info' +
                    chalk.white('\n------------------------') +
                    chalk.cyan('\nBot: ') +
                    chalk.magenta('v2.0-beta') +
                    chalk.cyan('\nNode.js: ') +
                    chalk.green(`${process.version}`) +
                    chalk.cyan('\nDiscord.js: ') +
                    chalk.blue(`${dependencies['discord.js']}`) +
                    chalk.cyan('\nUptime: ') +
                    chalk.yellow(ms(client.uptime)) +
                    chalk.cyan('\nGuilds: ') +
                    chalk.red(client.guilds.cache.size, 'Servers') +
                    chalk.cyan('\nUsers: ') +
                    chalk.white(totalUsers, 'Users')
                )
            )
        );
    },
};
