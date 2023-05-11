const mongoose = require('mongoose')

const perUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    roles: Array,
    warns: Number,
});

module.exports = mongoose.model('User', perUserSchema, 'Users');