// Create tests for POST Exercise, POST User, and GET Users

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
            userId: "59f86d76ee571c33c0357f33",
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
                expect(res.body.date).toBe(moment(newExercise.date).valueOf());
            })
            .end(done);
            // .end( async (err, res) => {
            //     if (err) {
            //         done(err);
            //     }

            //     try {
            //         const exercise = await Exercise.find({description: newExercise.description});
            //         expect(exercise.length).toBe(1);
            //         expect(exercise[0]).toMatchObject(newExercise);
            //     } catch (e) {
            //         done(e);
            //     }
            // });
    });

    // it('should add an exercise with a date', (done) => {
    //     const newExercise = {
    //         userId: "59f81a4befb50c535cdc31e5",
    //         description: "Went jogging",
    //         duration: "20"
    //     }

    //     request(app)
    //         .post('/api/exercise/add')
    //         .send(newExercise)
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body).toMatchObject(newExercise);
    //             expect(res.body.date).toBeTruthy();
    //         })
    //         .end(async (err, res) => {
    //             if (err) {
    //                 done(err);
    //             }

    //             try {
    //                 const exercise = await Exercise.find({ description: newExercise.description });
    //                 expect(exercise.length).toBe(1);
    //                 expect(exercise[0]).toMatchObject(newExercise);
    //                 expect(exercise[0].date).toBeTruthy();
    //             } catch (e) {
    //                 done(e);
    //             }
    //         });
    // });

    // it('should return an error for invalid exercise inputs', (done) => {
    //     const newExercise = {
    //         userId: "59f81a4befb50c535cdc31e5",
    //         description: "",
    //         duration: "20"
    //     }

    //     request(app)
    //         .post('/api/exercise/add')
    //         .send(newExercise)
    //         .expect(400)
    //         .expect((res) => {
    //             expect(res.body).toBeFalsy();
    //         })
    //         .end(done);
    // });
});