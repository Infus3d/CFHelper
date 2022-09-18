const mongoose = require('mongoose');

const Identification = new mongoose.Schema({
    guildId: String,
    channelId: String,
    userId: String,
    timeOutId: Number,
    userTag: String,
    handle: String,
    problem: {
        contestId: Number,
        index: String,
        name: String,
        rating: String,
    }
});

module.exports = mongoose.model("Identification", Identification);