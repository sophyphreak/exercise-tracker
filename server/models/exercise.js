const mongoose = require('mongoose');

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
    type: String
  }
});

module.exports = { Exercise };
