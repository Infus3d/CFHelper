const mongoose = require('mongoose');

const Reminder = new mongoose.Schema({
    guildId: String,
    channelId: String,
    userId: String,
    intervalId: Number,
    status: Boolean,
    userTag: String,
});

module.exports = mongoose.model("Reminder", Reminder, "reminders");