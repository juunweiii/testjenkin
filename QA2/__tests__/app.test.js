// __tests__/app.test.js
const request = require('supertest');
const app = require('../appTestAuto'); // Ensure the path is correct

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    console.log(res.body); // Add this line to log the response body
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Welcome to the API'); // Adjusted to check the specific message
  });
});
