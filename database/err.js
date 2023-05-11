module.exports = {
    name: 'err',
    execute(err, client) {
        client.logger.log(`An Error Has Occurred: \n${err}`, 'error');
        process.exit(1);
    },
};
