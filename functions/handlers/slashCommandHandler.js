const ascii = require("ascii-table");
const table = new ascii();
const slashCommands = [];
const devCommands = [];

const { loadFile } = require("../../utils/loadFile");

module.exports = async (client) => {
    await client.slashCommands.clear();
    await client.subCommands.clear();
    table.clear();
    table.setTitle("Slash Commands").setHeading("Name", "Status", "Note");

    const files = await loadFile("slashCommands");

    files.forEach((file) => {
        const command = require(file);
        if (command.setup) return;
        if (command.subCommand) {
            return client.subCommands.set(command.subCommand, command);
        } else slashCommands.push(command.data.toJSON());
        client.slashCommands.set(command.data.name, command);
        table.addRow(command.data.name, "Ready", "-");
    });
    console.log(String(table));

    client.devCommand = devCommands;
    client.slashCommand = slashCommands;
};
