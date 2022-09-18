const mongoose = require('mongoose');

const User = new mongoose.Schema({
    userId: String,
    userTag: String,
    handle: String,
});

module.exports = mongoose.model("User", User);