const ascii = require('ascii-table');
const table = new ascii();
const { loadFile } = require('../../utils/loadFile');

module.exports = async (client) => {
    await client.events.clear();
    table.clear();
    table.setHeading('Name', 'Status', 'Note').setTitle('Events');

    const files = await loadFile('events');
    client.setMaxListeners(files.length);
    files.forEach((file) => {
        const event = require(file);
        if (!event.name && !event.execute) {
            table.addRow(event.name, 'Error', 'No Name And Script');
            return;
        }

        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if (event.once) {
            client.once(event.name, execute);
            table.addRow(event.name, 'Ready', 'Once');
        } else if (event.system) {
            process.on(event.name, execute);
            table.addRow(event.name, 'Ready', 'System');
        } else if (event.rest) {
            if (event.once) {
                client.rest.once(event.name, execute);
            } else {
                client.rest.on(event.name, execute);
            }
            table.addRow(event.name, 'Ready', 'Rest');
        } else {
            client.on(event.name, execute);
            table.addRow(event.name, 'Ready', '-');
        }
    });
    console.log(String(table));
};
