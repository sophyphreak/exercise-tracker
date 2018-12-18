var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(`mongodb://localhost:27017/ExerciseTrackerTest`);
} else {
  mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds143245.mlab.com:43245/exercise-tracker`);
}

module.exports = { mongoose };
