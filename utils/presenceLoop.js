const { ActivityType, Status } = require('discord.js');

module.exports = function (client) {
    let i = 1;
    const presences = [
        {
            status: 'online',
            activities: [
                {
                    name: `/help | Terminal v2.1`,
                    type: ActivityType.Playing,
                },
            ],
        },
        {
            status: 'idle',
            activities: [
                {
                    name: `/help | Beta Testing...`,
                    type: ActivityType.Watching,
                },
            ],
        },
    ];

    setInterval(() => {
        client.user.setPresence(presences[i]);
        if (i === presences.length - 1) i = 0;
        else i++;
    }, 30 * 1000);
};
