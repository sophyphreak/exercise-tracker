require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const moment = require('moment');
// const mongoose = require('mongoose');
const path = require('path');

const app = express();
const {Exercise} = require('./models/exercise');
const {User} = require('./models/user');
const {mongoose} = require('./db/mongoose');
const publicPath = path.join(__dirname, '../public');

// mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' );

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(publicPath));

app.post('/api/exercise/new-user', async (req, res) => {
  try {
    const body = _.pick(req.body, ['username']);
    const user = new User(body);
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  };
});

app.get('/api/exercise/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Problems: 
// - 'date' is null when it is not included
// - 'date' when included throws an error. Need to convert to usable form with moment
app.post('/api/exercise/add', async (req, res) => {
  try {
    const body = _.pick(req.body, ['userId', 'description', 'duration', 'date']);
    const user = await User.findOne({
      _id: body.userId
    });
    if (!user) {
      return res.status(404).send('id not found');
    };
    if (!body.date) {
      body.date = moment().format("YYYY-M-D");
    } else {
      body.date = moment(body.date).format("YYYY-M-D");
    }
    const exercise = new Exercise(body)
    const doc = await exercise.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  };
});

/* 
I can retrieve a full exercise log of any user by getting
/api/exercise/log with a parameter of userId(_id). App will 
return the user object with added array log and count 
(total exercise count).
*/

app.get('/api/exercise/log/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
      if (!user) {
        res.status(404).send('User not found');
      }
    const exercises = await Exercise.find({userId});
    const count = exercises.length;
    const fullLog = {
      user,
      exercises,
      count
    };
    res.send(fullLog);
  } catch(e) {
    res.status(400).send(e);
  };
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = { app };