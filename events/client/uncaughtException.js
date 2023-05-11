module.exports = {
    name: 'uncaughtException',
    system: true,
    execute(err, origin, client) {
        client.logger.log(`Caught an exception: \n ${err.stack || err}`, 'error');
    },
};
