const mongoose = require('mongoose');

const jTCSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelId: String,
    ownerId: String,
});

module.exports = mongoose.model('Jtc', jTCSchema, 'JoinToCreate');
