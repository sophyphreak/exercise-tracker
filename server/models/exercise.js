var mongoose = require('mongoose');

var Exercise = mongoose.model('Exercise', {
    userId: {
        type: Number,
        required: true
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
