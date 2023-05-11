module.exports = {
    name: 'error',
    execute(error, client) {
        client.logger.log(`Bot has got an error: \n${error.stack || error}`, 'error');
    },
};
