module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isSelectMenu() && interaction.customId === 'setup-menu') {
            require(`../../slashCommands/setups/${interaction.values[0]}`).execute(
                interaction,
                client
            );
        }

        return;
    },
};
