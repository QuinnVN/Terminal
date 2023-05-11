module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isAutocomplete()) return;

        let cmd;
        const subCmd = interaction.options.getSubcommand(false);

        if (subCmd) {
            cmd = client.subCommands.get(interaction.commandName + '.' + subCmd);
        } else {
            cmd = client.slashCommand.get(interaction.commandName);
        }

        if (!cmd) return client.logger.log('Cannot find this command', 'error');

        try {
            cmd.autocomplete(interaction, client);
        } catch (err) {
            client.logger.log(err.stack, 'error');
        }
    },
};
