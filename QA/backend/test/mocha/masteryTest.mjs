import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import generateCreds from "./creds.mjs";
import * as baseChai from "chai";
import chaiHttp from "chai-http";
import Redis from 'ioredis';
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chai = baseChai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;

const authDir = __dirname;
const uniqueId = uuidv4();
const username = `user_${uniqueId}`;
const email = `user_${uniqueId}@example.com`;
const uniqueTopicTitle = `Unique Topic ${uuidv4()}`;
const updatedTopicTitle = `Updated Topic ${uuidv4()}`;
let topicId;
let allTopicIds = [];
let allSubTopicIds = [];

const uniqueSubTopicTitle = `New SubTopic ${uuidv4()}`;
let subTopicId;
const updatedSubTopicTitle = `Updated SubTopic ${uuidv4()}`;

let allThreadIds = [];
let threadId;
const uniqueThreadContent = `New Thread Content ${uuidv4()}`;
const updatedThreadContent = `Updated Thread Content ${uuidv4()}`;

let allUserIds = [];
let userId;
let randomUserId; // For update role and ban tests

describe('Sequential Tests', function() {
    this.timeout(120000); // Set a higher timeout for the entire describe block

    let usertoken, usercsrfToken, usercsrfSecret, admintoken, admincsrfToken, admincsrfSecret, modtoken, modcsrfToken, modcsrfSecret;

    before(async function() {
        // This will be executed before running the tests
        const creds = await generateCreds();
        usertoken = creds.USER_JWT;
        usercsrfToken = creds.USER_CSRF_TOKEN;
        usercsrfSecret = creds.USER_CSRF_SECRET;

        admintoken = creds.ADMIN_JWT;
        admincsrfToken = creds.ADMIN_CSRF_TOKEN;
        admincsrfSecret = creds.ADMIN_CSRF_SECRET;

        modtoken = creds.MOD_JWT;
        modcsrfToken = creds.MOD_CSRF_TOKEN;
        modcsrfSecret = creds.MOD_CSRF_SECRET;
    });

    it('Should run Register API Test', function(done) {
        request.execute('http://localhost:3010')
            .post('/api/auth/v1/register')
            .send({
                username: username,
                email: email,
                password: 'Th3St!mM3r',
                profilePicture: "http://assets/bob5.png"
            })
            .end((err, res) => {
                if (err) {
                    console.error("Error:", err);
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('statusCode').that.equals(200);
                        expect(res.body).to.have.property('message').that.equals('Temporarily registered, please enter OTP sent to your email (10mins). Check your spam folder for email.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Register OTP API Test', function(done) {
        const redisClient = new Redis({
            host: 'localhost',
            port: 6379,
            password: process.env.REDIS_PASSWORD,
        });

        (async () => {
            try {
                // Find the correct key for the OTP
                const keys = await redisClient.keys(`register:*`);
                let fetchedOtp;
                for (let key of keys) {
                    const keyType = await redisClient.type(key);
                    console.log(`Key: ${key}, Type: ${keyType}`); // Debugging line
                    if (keyType === 'ReJSON-RL') {
                        const jsonData = await redisClient.call('JSON.GET', key, '.');
                        const data = JSON.parse(jsonData);
                        console.log(`Data from Redis for key ${key}: ${jsonData}`); // Debugging line
                        if (data.email === email) {
                            fetchedOtp = data.otp;
                            break;
                        }
                    }
                }
                console.log(`Fetched OTP from Redis: ${fetchedOtp}`); // Debugging line
                if (!fetchedOtp) {
                    throw new Error("OTP not found for the user.");
                }
                // Now make the GET request to verify the OTP
                request.execute('http://localhost:3010')
                    .get('/api/auth/v1/registerOTP')
                    .query({ email, otp: fetchedOtp })
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log("Response Body:", res.body);
                            try {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body).to.have.property('statusCode').that.equals(200);
                                expect(res.body).to.have.property('message').that.equals('Successfully added into database');
                                done();
                            } catch (assertErr) {
                                done(assertErr);
                            }
                        }
                    });
            } catch (err) {
                console.error("Error:", err);
                done(err);
            } finally {
                redisClient.disconnect();
            }
        })();
    });

    it('Should run Forget Password API Test', function(done) {
        request.execute('http://localhost:3010')
            .post('/api/auth/v1/passwordReset')
            .send({
                email: email
            })
            .end((err, res) => {
                if (err) {
                    console.error("Error:", err);
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('statusCode').that.equals(200);
                        expect(res.body).to.have.property('message').that.equals('Password Reset OTP has been sent to your email (10mins). Check your spam folder for email.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Password Reset OTP API Test', function(done) {
        const redisClient = new Redis({
            host: 'localhost',
            port: 6379,
            password: process.env.REDIS_PASSWORD,
        });

        (async () => {
            try {
                // Find the correct key for the OTP
                const keys = await redisClient.keys(`passwordReset:*`);
                let fetchedOtp;
                for (let key of keys) {
                    const keyType = await redisClient.type(key);
                    console.log(`Key: ${key}, Type: ${keyType}`); // Debugging line

                    if (keyType === 'ReJSON-RL') {
                        const jsonData = await redisClient.call('JSON.GET', key, '.');
                        const data = JSON.parse(jsonData);
                        console.log(`Data from Redis for key ${key}: ${jsonData}`); // Debugging line

                        if (data.email === email) {
                            fetchedOtp = data.otp;
                            break;
                        }
                    }
                }

                console.log(`Fetched OTP from Redis: ${fetchedOtp}`); // Debugging line
                if (!fetchedOtp) {
                    throw new Error("OTP not found for the email.");
                }

                // Now make the POST request to verify the OTP
                request.execute('http://localhost:3010')
                    .post('/api/auth/v1/passwordResetOTP')
                    .send({ email: email, password: process.env.REDIS_PASSWORD, otp: fetchedOtp })
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log("Response Body:", res.body);
                            try {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body).to.have.property('statusCode').that.equals(200);
                                expect(res.body).to.have.property('message').that.equals('Successfully reset password.');
                                done();
                            } catch (assertErr) {
                                done(assertErr);
                            }
                        }
                    });
            } catch (err) {
                console.error("Error:", err);
                done(err);
            } finally {
                redisClient.disconnect();
            }
        })();
    });

    it('Should run Post Topics API Test', function(done) {
        const topicData = {
            title: uniqueTopicTitle,
            content: "This is a User made new topic content",
            category: "General"
        };
        console.log(`Topic Title: ${uniqueTopicTitle}`); // Log the unique topic title

        request.execute('http://localhost:3010')
            .post('/api/topics/v1/postTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(topicData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully created a new topic.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Get All Topics API Test', function(done) {
        request.execute('http://localhost:3010')
            .get('/api/topics/v1/getAllTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${admintoken}; csrf_token=${admincsrfToken}; _csrf=${admincsrfSecret}`)
            .query({
                limit: 10,
                offset: 0,
                sortField: 'topicsId',
                sortOrder: 'asc'
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    // console.log("Response Body:", res.body);
                    // console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        expect(res.body.data).to.have.property('total').that.is.a('number');
                        expect(res.body.data).to.have.property('result').that.is.an('array');

                        console.log("Retrieved Topics:", res.body.data.result);

                        // Extract a random topicsId from the response
                        const topics = res.body.data.result;
                        if (topics.length === 0) {
                            throw new Error('No topics found in Get All Topics API response');
                        }
                        allTopicIds = topics.map(topic => topic.topicsId);
                        topicId = allTopicIds[Math.floor(Math.random() * allTopicIds.length)];
                        console.log(`Selected Topic ID for Subtopics Test: ${topicId}`);
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Get Topics API Test', function(done) {
        if (!topicId) {
            done(new Error('No topicId available from Get All Topics API test'));
            return;
        }

        request.execute('http://localhost:3010')
            .get('/api/topics/v1/getTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .query({ topicsId: topicId })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Update Topics API Test', function(done) {
        const topicData = {
            topicsId: topicId, // Using topicId from the Get All Topics API test
            title: updatedTopicTitle,
            description: "3 to the 3 to the 6 to the 9."
        };

        request.execute('http://localhost:3010')
            .patch('/api/topics/v1/updateTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(topicData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update topics.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Delete Topics API Test', function(done) {
        if (allTopicIds.length <= 1) {
            done(new Error('Not enough topics available to perform delete test'));
            return;
        }
        const remainingTopicIds = allTopicIds.filter(id => id !== topicId);
        const deleteTopicId = remainingTopicIds[Math.floor(Math.random() * remainingTopicIds.length)];
        const deleteData = { topicsId: deleteTopicId }; // Using topicId from the Get All Topics API test
        request.execute('http://localhost:3010')
            .delete('/api/topics/v1/deleteTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(deleteData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        if (res.status === 200) {
                            expect(res.body).to.have.property('message').that.equals('Successfully deleted topics.');
                        } else if (res.status === 400) {
                            expect(res.body).to.have.property('message').that.equals('Topic does not exists.');
                        }
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Post Subtopics API Test', function(done) {
        if (!topicId) {
            done(new Error('No topicId available from Get All Topics API test'));
            return;
        }
        const subTopicData = {
            topicsId: topicId,
            title: uniqueSubTopicTitle,
            description: "This is a User made new subtopic description"
        };

        // Log the topicId and subTopicData for debugging
        console.log(`SubTopic Title: ${uniqueSubTopicTitle}`); // Log the unique subtopic title
        console.log(`Topic id: ${topicId}`); // Log the topic id
        console.log(`SubTopic Data: ${JSON.stringify(subTopicData)}`); // Log the subtopic data

        request.execute('http://localhost:3010')
            .post('/api/subtopics/v1/postSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(subTopicData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully created a new subtopic.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });


    it('Should run Get All Subtopics API Test', function(done) {
        request.execute('http://localhost:3010')
            .get('/api/subtopics/v1/getAllSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${admintoken}; csrf_token=${admincsrfToken}; _csrf=${admincsrfSecret}`)
            .query({
                limit: 10,
                offset: 0,
                sortField: 'subTopicsId',
                sortOrder: 'asc'
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    // console.log("Response Body:", res.body);
                    // console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        expect(res.body.data).to.have.property('total').that.is.a('number');
                        expect(res.body.data).to.have.property('result').that.is.an('array');

                        console.log("Retrieved Subtopics:", res.body.data.result);

                        // Extract a random subTopicsId from the response
                        const subtopics = res.body.data.result;
                        if (subtopics.length === 0) {
                            throw new Error('No subtopics found in Get All Subtopics API response');
                        }
                        allSubTopicIds = subtopics.map(subtopic => subtopic.subTopicsId);
                        subTopicId = allSubTopicIds[Math.floor(Math.random() * allSubTopicIds.length)];
                        console.log(`Selected SubTopic ID for Subtopics Test: ${subTopicId}`);
                        done();

                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Get Subtopics API Test', function(done) {
        if (!subTopicId) {
            done(new Error('No subTopicsId available from Get All Subtopics API test'));
            return;
        }

        request.execute('http://localhost:3010')
            .get('/api/subtopics/v1/getSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .query({ subTopicsId: subTopicId })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved subtopic.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        expect(res.body.data).to.have.property('subTopicsId').that.equals(subTopicId);
                        expect(res.body.data).to.have.property('title').that.is.a('string');
                        expect(res.body.data).to.have.property('description').that.is.a('string');
                        expect(res.body.data).to.have.property('topicsId').that.is.a('string');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Update Subtopics API Test', function(done) {
        const subTopicData = {
            subTopicsId: subTopicId, // Using subTopicId from the Get All Subtopics API test
            title: updatedSubTopicTitle,
            description: "Updated description for subtopic."
        };

        request.execute('http://localhost:3010')
            .patch('/api/subtopics/v1/updateSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(subTopicData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update subtopic.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Like or Dislike Subtopics API Test', function(done) {
        const likeData = {
            subTopicsId: subTopicId, // Using subTopicId from the Get All Subtopics API test
            like: false,
            dislike: true
        };

        request.execute('http://localhost:3010')
            .patch('/api/subtopics/v1/likeOrDislikeSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .send(likeData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update subtopic\'s like(s).');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

    it('Should run Delete Subtopics API Test', function(done) {
        if (allSubTopicIds.length <= 1) {
            done(new Error('Not enough subtopics available to perform delete test'));
            return;
        }
        // Remove the subTopicId used for other subtopic tests from the list
        const remainingSubTopicIds = allSubTopicIds.filter(id => id !== subTopicId);
        const deleteSubTopicId = remainingSubTopicIds[Math.floor(Math.random() * remainingSubTopicIds.length)];

        const deleteData = { subTopicsId: deleteSubTopicId };
        request.execute('http://localhost:3010')
            .delete('/api/subtopics/v1/deleteSubTopics')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(deleteData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        if (res.status === 200) {
                            expect(res.body).to.have.property('message').that.equals('Successfully deleted subtopic.');
                        } else if (res.status === 400) {
                            expect(res.body).to.have.property('message').that.equals('Subtopic does not exists.');
                        }
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    // Post Threads API Test
    it('Should run Post Threads API Test', function(done) {
        if (!subTopicId) {
            done(new Error('No subTopicsId available from previous tests'));
            return;
        }
        const threadData = {
            subTopicsId: subTopicId,
            content: uniqueThreadContent
        };

        request.execute('http://localhost:3010')
            .post('/api/threads/v1/postThreads')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .send(threadData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully created a new thread.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        threadId = res.body.data.threadsId;
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

// Get All Threads API Test
    it('Should run Get All Threads API Test', function(done) {
        request.execute('http://localhost:3010')
            .get('/api/threads/v1/getAllThreads')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${admintoken}; csrf_token=${admincsrfToken}; _csrf=${admincsrfSecret}`)
            .query({
                limit: 10,
                offset: 0,
                sortField: 'threadsId',
                sortOrder: 'asc'
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        expect(res.body.data).to.have.property('total').that.is.a('number');
                        expect(res.body.data).to.have.property('result').that.is.an('array');

                        console.log("Retrieved Threads:", res.body.data.result);

                        // Store all threadsId from the response
                        const threads = res.body.data.result;
                        if (threads.length === 0) {
                            throw new Error('No threads found in Get All Threads API response');
                        }
                        allThreadIds = threads.map(thread => thread.threadsId);
                        threadId = allThreadIds[Math.floor(Math.random() * allThreadIds.length)];
                        console.log(`Selected Thread ID for Tests: ${threadId}`);
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

// Get Threads API Test
    it('Should run Get Threads API Test', function(done) {
        if (!threadId) {
            done(new Error('No threadId available from Get All Threads API test'));
            return;
        }

        request.execute('http://localhost:3010')
            .get('/api/threads/v1/getThreads')
            .query({ threadsId: threadId })
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

// Update Threads API Test
    it('Should run Update Threads API Test', function(done) {
        const threadData = {
            threadsId: threadId,
            content: updatedThreadContent
        };

        request.execute('http://localhost:3010')
            .patch('/api/threads/v1/updateThreads')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(threadData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update threads.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

// Like or Dislike Threads API Test
    it('Should run Like or Dislike Threads API Test', function(done) {
        const likeData = {
            threadsId: threadId,
            like: true,
            dislike: false
        };

        request.execute('http://localhost:3010')
            .patch('/api/threads/v1/likeOrDislikeThreads')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${usertoken}; csrf_token=${usercsrfToken}; _csrf=${usercsrfSecret}`)
            .send(likeData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update thread\'s like(s).');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });

// Delete Threads API Test
    it('Should run Delete Threads API Test', function(done) {
        // Debugging information
        console.log(`All Thread IDs: ${allThreadIds}`);
        console.log(`Thread ID used for other tests: ${threadId}`);

        if (allThreadIds.length <= 1) {
            done(new Error('Not enough threads available to perform delete test'));
            return;
        }

        // Remove the threadId used for other thread tests from the list
        const remainingThreadIds = allThreadIds.filter(id => id !== threadId);
        if (remainingThreadIds.length === 0) {
            done(new Error('No remaining threads available to perform delete test'));
            return;
        }

        const deleteThreadId = remainingThreadIds[Math.floor(Math.random() * remainingThreadIds.length)];

        const deleteData = { threadsId: deleteThreadId };

        request.execute('http://localhost:3010')
            .delete('/api/threads/v1/deleteThreads')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .send(deleteData)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        if (res.status === 200) {
                            expect(res.body).to.have.property('message').that.equals('Successfully deleted thread.');
                        } else if (res.status === 400) {
                            expect(res.body).to.have.property('message').that.equals('Thread does not exists.');
                        }
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Get All Users API Test', function(done) {
        request.execute('http://localhost:3010')
            .get('/api/users/v1/getAllUsers')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .query({
                limit: 100, // Increase the limit to retrieve more users
                offset: 0,
                sortField: 'usersId',
                sortOrder: 'asc'
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved all data.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        expect(res.body.data).to.have.property('total').that.is.a('number');
                        expect(res.body.data).to.have.property('result').that.is.an('array');

                        console.log("Retrieved Users:", res.body.data.result);

                        // Store all usersId from the response
                        const users = res.body.data.result;
                        if (users.length === 0) {
                            throw new Error('No users found in Get All Users API response');
                        }
                        allUserIds = users.map(user => user.usersId);
                        userId = allUserIds[Math.floor(Math.random() * allUserIds.length)];

                        // Select a random user with the role "user"
                        const userMatches = Array.from(users.filter(user => user.role === 'user').map(user => user.usersId));
                        if (userMatches.length === 0) {
                            throw new Error('No users with role "user" found in Get All Users API response');
                        }
                        randomUserId = userMatches[Math.floor(Math.random() * userMatches.length)];
                        console.log(`Selected User ID for Tests: ${userId}`);
                        console.log(`Selected User ID for Role/Ban Tests: ${randomUserId}`);
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Get Users API Test', function(done) {
        if (!userId) {
            done(new Error('No userId available from Get All Users API test'));
            return;
        }

        request.execute('http://localhost:3010')
            .get('/api/users/v1/getUsers')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .query({ usersId: userId })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved user.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Get Users Rep API Test', function(done) {
        if (!userId) {
            done(new Error('No userId available from Get All Users API test'));
            return;
        }

        request.execute('http://localhost:3010')
            .get('/api/users/v1/getUsersRep')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .query({ usersId: userId })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    console.log("Response Status:", res.status);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully retrieved user reputation.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Update Users API Test', function(done) {
        if (!userId) {
            done(new Error('No userId available from Get All Users API test'));
            return;
        }

        const userData = {
            usersId: userId,
            username: "megatron",
            email: "megatron@gmail.com",
            profilePicture: "http://assets/bobby123123123.png"
        };

        request.execute('http://localhost:3010')
            .patch('/api/users/v1/updateUsers')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .set('Content-Type', 'application/json')
            .send(userData)
            .end((err, res) => {
                if (err) {
                    console.error('Error:', err);
                    console.error('Error response body:', err.response ? err.response.body : 'No response body');
                    console.error('Error response headers:', err.response ? err.response.headers : 'No response headers');
                    done(err);
                } else {
                    console.log('Response status:', res.status);
                    console.log('Response body:', res.body);
                    try {
                        expect([200, 403]).to.include(res.status);
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Update Users Role API Test', function(done) {
        if (!randomUserId) {
            done(new Error('No user with role "user" found from Get All Users API test'));
            return;
        }

        const userData = {
            usersId: randomUserId,
            role: "user"
        };

        request.execute('http://localhost:3010')
            .patch('/api/users/v1/updateUsersRole')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${admintoken}; csrf_token=${admincsrfToken}; _csrf=${admincsrfSecret}`)
            .set('Content-Type', 'application/json')
            .send(userData)
            .end((err, res) => {
                if (err) {
                    console.error('Error:', err);
                    console.error('Error response body:', err.response ? err.response.body : 'No response body');
                    console.error('Error response headers:', err.response ? err.response.headers : 'No response headers');
                    done(err);
                } else {
                    console.log('Response status:', res.status);
                    console.log('Response body:', res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update user role.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Ban Users API Test', function(done) {
        if (!randomUserId) {
            done(new Error('No user with role "user" found from Get All Users API test'));
            return;
        }

        const userData = {
            usersId: randomUserId,
            isBanned: true
        };

        request.execute('http://localhost:3010')
            .patch('/api/users/v1/banUsers')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .set('Content-Type', 'application/json')
            .send(userData)
            .end((err, res) => {
                if (err) {
                    console.error('Error:', err);
                    console.error('Error response body:', err.response ? err.response.body : 'No response body');
                    console.error('Error response headers:', err.response ? err.response.headers : 'No response headers');
                    done(err);
                } else {
                    console.log('Response status:', res.status);
                    console.log('Response body:', res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully update user ban status.');
                        expect(res.body).to.have.property('data').that.is.an('object');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
    it('Should run Logout API Test', function(done) {
        request.execute('http://localhost:3010')
            .post('/api/auth/v1/logout')
            .set('Accept', 'application/json')
            .set('Cookie', `jwt=${modtoken}; csrf_token=${modcsrfToken}; _csrf=${modcsrfSecret}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log("Response Body:", res.body);
                    try {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('message').that.equals('Successfully logout.');
                        done();
                    } catch (assertErr) {
                        done(assertErr);
                    }
                }
            });
    });
});