// Create tests for POST Exercise, POST User, and GET Users

const expect = require('expect');
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