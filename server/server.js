require('./config/config');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
// const mongoose = require('mongoose');
const path = require('path');

const app = express();
const {mongoose} = require('./db/mongoose');
const publicPath = path.join(__dirname, '../public');

// mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' );

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(publicPath));

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

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
