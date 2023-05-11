module.exports = {
    name: 'unhandledRejection',
    system: true,
    execute(reason, promise, client) {
        client.logger.log(`Caught an rejection: \n ${reason.stack || reason}`, 'error');
    },
};
