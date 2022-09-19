const mongoose = require('mongoose');

const User = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        immutable: true,
    },
    userTag: String,
    handle: {
        type: String,
        required: true,
        immutable: true,
    },
});

module.exports = mongoose.model("User", User);