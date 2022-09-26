const mongoose = require('mongoose');

const Problem = new mongoose.Schema({
    contestId: Number,
    index: String,
    name: String,
    type: String,
    points: Number,
    rating: Number,
    tags: [String],
});

module.exports = mongoose.model("Problem", Problem);