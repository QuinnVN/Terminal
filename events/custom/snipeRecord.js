module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        client.snipes.set(message.channel.id, {
            author: message.author,
            content: message.content,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        });
    },
};
