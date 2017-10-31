const { ObjectID } = require('mongodb');
const moment = require('moment');

const { User } = require('./../../models/user');
const { Exercise } = require('./../../models/exercise');

const userOneId = new ObjectID("59f86d76ee571c33c0357f33");
const userTwoId = new ObjectID("59f86d76ee571c33c0357f34");
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
    date: moment('2017-9-10').format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userTwoId,
    description: 'Did some calligraphy',
    duration: 10,
    date: moment().format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Went fishing',
    duration: 60,
    date: moment('2017-10-9').format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Planted potatoes',
    duration: 20,
    date: moment('2017-8-9').format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Danced in a circle',
    duration: 17,
    date: moment('2000-8-9').format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Did the dishes',
    duration: 17.5,
    date: moment('1999-8-9').format("YYYY-M-D")
}, {
    _id: new ObjectID(),
    userId: userOneId,
    description: 'Did the dishes',
    duration: 1111,
    date: moment('1970-8-9').format("YYYY-M-D")
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
