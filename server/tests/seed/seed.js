const { ObjectID } = require('mongodb');
const moment = require('moment');

const { User } = require('./../../models/user');
const { Exercise } = require('./../../models/exercise');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    username: 'sophyphreak'
}, {
    _id: userTwoId,
    username: 'xiuShenQiJiaZhiGuoPingTianxia'
}];

const exercises = [{
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Went for a walk',
    duration: 20,
    date: moment(2017-9-10).valueOf()
}, {
    _id: new ObjectID(),
    userId: userTwoId,
    description: 'Did some calligraphy',
    duration: 10,
    date: moment().valueOf()
}];

const populateExercises = async () => {
    await Exercise.remove({});
    await Exercise.insertMany(exercises);
};

const populateUsers = async () => {
    await User.remove({});
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();
    await Promise.all([userOne, userTwo]);
};

module.exports = { 
    exercises, 
    populateExercises, 
    users, 
    populateUsers 
};
