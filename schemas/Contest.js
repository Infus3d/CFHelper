const mongoose = require('mongoose');

const Contest = new mongoose.Schema({
    id: Number,
    name: String,
    type: String,
    phase: String,
    frozen: Boolean,
    durationSeconds: Number,
    startTimeSeconds: Number,
    relativeTimeSeconds: Number,
});

module.exports = mongoose.model("Contest", Contest);