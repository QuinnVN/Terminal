const Guild = require('../../schemas/guild');
const Jtc = require('../../schemas/jTC');
const mongoose = require('mongoose');
const { VoiceState, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async execute(oldState, newState, client) {
        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        const thisGuild = await Guild.findOne({ guildId: guild.id });
        if (!thisGuild || !thisGuild.jTC) return;

        const player = client.manager.players.get(guild.id);

        // Join a channel
        if (!oldChannel && newChannel) {
            if (newChannel.id === thisGuild.jTC) {
                const voiceChannel = await guild.channels.create({
                    name: `${member.user.username}'s Channel`,
                    type: ChannelType.GuildVoice,
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.ManageChannels,
                                PermissionsBitField.Flags.ManageRoles,
                            ],
                        },
                        ...newChannel.parent.permissionOverwrites.cache.values(),
                    ],
                });
                await new Jtc({
                    _id: mongoose.Types.ObjectId(),
                    channelId: voiceChannel.id,
                    ownerId: member.id,
                }).save();
                client.logger.log(
                    `Created a Join To Create voice channel in ${guild.name} for ${member.user.tag}`
                );
                return await member.voice.setChannel(voiceChannel);
            }
        }

        // Leave a channel
        if (oldChannel && !newChannel) {
            const isJtcChannel = await Jtc.findOne({ channelId: oldChannel.id });
            if (
                player &&
                oldChannel.members.filter((member) => !member.user.bot).size < 1 &&
                oldChannel.id === player.voiceChannel
            )
                try {
                    player.stop();
                    player.queue.clear();
                    client.logger.log('Stopped the music because of Emptyness');
                } catch {}
            if (isJtcChannel && oldChannel.members.size < 1) {
                await Jtc.findOneAndDelete({ channelId: oldChannel.id });
                await oldChannel.delete().catch(() => {});
                return client.logger.log('Deleted a Join To Create channel because of Emptyness');
            }
        }
        //Switch channels
        if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
            const isJtcChannel = await Jtc.findOne({ channelId: oldChannel.id });
            if (newChannel.id === thisGuild.jTC) {
                const voiceChannel = await guild.channels.create({
                    name: `${member.user.username}'s Channel`,
                    type: ChannelType.GuildVoice,
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.ManageChannels,
                                PermissionsBitField.Flags.ManageRoles,
                            ],
                        },
                        ...newChannel.parent.permissionOverwrites.cache.values(),
                    ],
                });
                await new Jtc({
                    _id: mongoose.Types.ObjectId(),
                    channelId: voiceChannel.id,
                    ownerId: member.id,
                }).save();
                client.logger.log(
                    `Created a Join To Create voice channel in ${guild.name} for ${member.user.tag}`
                );
                return await member.voice.setChannel(voiceChannel);
            } else if (
                player &&
                oldChannel.members.filter((member) => !member.user.bot).size < 1 &&
                oldChannel.id === player.voiceChannel &&
                newChannel.id !== player.voiceChannel
            ) {
                try {
                    player.stop();
                    player.queue.clear();
                    client.logger.log('Stopped the music because of Emptyness');
                } catch {}
            } else if (isJtcChannel && oldChannel.members.size < 1) {
                await Jtc.findOneAndDelete({ channelId: oldChannel.id });
                await oldChannel.delete().catch(() => {});
                return client.logger.log('Deleted a Join To Create channel because of Emptyness');
            }
        }
    },
};
