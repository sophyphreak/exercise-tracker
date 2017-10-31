const mongoose = require('mongoose');
const moment = require('moment');

const Exercise = mongoose.model('Exercise', {
    userId: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Number
    }
});

module.exports = { Exercise };
