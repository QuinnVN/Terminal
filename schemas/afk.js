const mongoose = require('mongoose');

const AfkSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    guildId: String,
    afk: String
});

module.exports = mongoose.model('Afk', AfkSchema, 'Afk');
