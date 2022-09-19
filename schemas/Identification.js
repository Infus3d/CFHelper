const mongoose = require('mongoose');

const Identification = new mongoose.Schema({
    guildId: String,
    channelId: String,
    userId: {
        type: String,
        required: true,
        immutable: true,
    },
    tOutId: {
        type: Number,
        immutable: true,
        // required: true,
    },
    startedAt: Number,
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