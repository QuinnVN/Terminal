module.exports = {
    name: 'connected',
    execute(client) {
        client.logger.log('Connected To Database', 'info');
    }
}