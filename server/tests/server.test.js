const expect = require('expect');
const moment = require('moment');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Exercise } = require('./../models/exercise');
const { User } = require('./../models/user');
const { exercises, populateExercises, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateExercises);

describe('POST /api/exercise/new-user', () => {
    it('should create a new user', (done) => {
        const username = 'bobJones';
        
        request(app)
            .post('/api/exercise/new-user')
            .send({username})
            .expect(200)
            .expect((res) => {
                expect(res.body.username).toEqual(username);
            })
            .end(async (err, res) => {
                if (err) {
                    return done(err);
                }

                try {
                    const users = await User.find({username});
                    expect(users.length).toBe(1);
                    expect(users[0].username).toBe(username);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it('should fail to create a new user with invalid data', (done) => {
        const username = '';

        request(app)
            .post('/api/exercise/new-user')
            .send({username})
            .expect(400)
            .end(done);
    });
});

describe('GET /api/exercise/users', () => {
    it('should get a list of users', (done) => {
        request(app)
            .get('/api/exercise/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done);
    });
});

describe('POST /api/exercise/add', () => {
    it('should add an exercise with the given date', (done) => {
        const newExercise = {
            userId: users[0]._id.toHexString(),
            description: "Went swimming",
            duration: "30",
            date: "2017-10-1"
        }
        
        request(app)
            .post('/api/exercise/add')
            .send(newExercise)
            .expect(200)
            .expect((res) => {
                expect(res.body.userId).toBe(newExercise.userId);
                expect(res.body.description).toBe(newExercise.description);
                expect(res.body.duration).toBe(parseInt(newExercise.duration));
                expect(res.body.date).toBe(newExercise.date);
            })
            .end( async (err, res) => {
                if (err) {
                    done(err);
                }

                try {
                    const exercise = await Exercise.find({description: newExercise.description});
                    expect(exercise.length).toBe(1);
                    expect(exercise[0].userId).toBe(newExercise.userId);
                    expect(exercise[0].description).toBe(newExercise.description);
                    expect(exercise[0].duration).toBe(parseInt(newExercise.duration));
                    expect(exercise[0].date).toBe(newExercise.date);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should add an exercise with a date', (done) => {
        const newExercise = {
            userId: users[0]._id.toHexString(),            
            description: "Went jogging",
            duration: "20"
        }

        request(app)
            .post('/api/exercise/add')
            .send(newExercise)
            .expect(200)
            .expect((res) => {
                expect(res.body.userId).toBe(newExercise.userId);
                expect(res.body.description).toBe(newExercise.description);
                expect(res.body.duration).toBe(parseInt(newExercise.duration));
                expect(res.body.date).toBeTruthy();
            })
            .end(async (err, res) => {
                if (err) {
                    done(err);
                }

                try {
                    const exercise = await Exercise.find({ description: newExercise.description });
                    expect(exercise.length).toBe(1);
                    expect(exercise[0].userId).toBe(newExercise.userId);
                    expect(exercise[0].description).toBe(newExercise.description);
                    expect(exercise[0].duration).toBe(parseInt(newExercise.duration));
                    expect(exercise[0].date).toBeTruthy();
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should return an error for invalid exercise inputs', (done) => {
        const newExercise = {
            userId: users[0]._id.toHexString(),                        
            description: "thing thing thing",
            duration: ""
        }

        request(app)
            .post('/api/exercise/add')
            .send(newExercise)
            .expect(400)
            .end( async (err, res) => {
                try {
                    const exercises = await Exercise.find({description: newExercise.description});
                    expect(exercises.length).toBe(0);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });
});

describe('GET /api/exercises/log/:userId', () => {
    it('should get a log of all exercises for one user', (done) => {
        const userId = users[0]._id.toHexString();
        request(app)
            .get(`/api/exercise/log/${userId}`)
            .expect(200)
            .expect((res) => {
                const result = res.body;
                expect(result.user._id).toBe(userId);
                expect(result.user.username).toBe(users[0].username);
                expect(result.exercises.length).toBe(3);
                expect(result.count).toBe(3);
            })
            .end(done);
    });
});