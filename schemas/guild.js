const mongoose = require('mongoose');
const config = require('../config.json');

const perGuildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    jTC: String,
    antiphish: Boolean,
});

module.exports = mongoose.model('Guild', perGuildSchema, 'Guilds');
