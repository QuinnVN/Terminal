const mongoose = require("mongoose");
require("dotenv").config();
const { bot } = require("../../config.json");
const { loadFile } = require("../../utils/loadFile");

module.exports = async (client) => {
    const dbEvents = await loadFile("database");
    dbEvents.forEach((file) => {
        const event = require(file);
        mongoose.connection.on(event.name, (...args) => event.execute(...args, client));
    });

    mongoose.Promise = global.Promise;
    await mongoose.connect(bot.mongoURL, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
};
