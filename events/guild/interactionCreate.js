const { dev } = require('../../config.json');
const Guild = require('../../schemas/guild.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({
            guildId: interaction.guild.id,
        });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
            });
            await guildProfile.save().catch((err) => console.error(err));
        }

        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        if (command.developer && interaction.user.id !== dev.devUserId) {
            interaction.reply('You dont have permission to use this command');
            return;
        }

        const subCommand = interaction.options.getSubcommand(false);
        if (subCommand) {
            const subCommandFile = client.subCommands.get(
                `${interaction.commandName}.${subCommand}`
            );
            if (!subCommandFile)
                return interaction.reply({ content: 'Outdated sub command', ephemeral: true });

            try {
                subCommandFile.execute(interaction, client);
            } catch (err) {
                client.logger.log(`Error executing sub command: \n${err.stack}`, 'error');
            }
        } else {
            try {
                command.execute(client, interaction);
            } catch (err) {
                client.logger.log(`Error executing slash command: \n${err.stack}`, 'error');
            }
        }
    },
};
