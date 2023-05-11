module.exports = {
    name: 'disconnected',
    execute(client) {
        client.logger.log('Disconnected From Database...', 'warn');
    },
};
