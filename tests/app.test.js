process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
    console.log('Running beforeAll for app tests');
});

describe('App Routes', () => {
    it('should return a welcome message for the root route', async () => {
        console.log('Sending GET request to root route');
        const res = await request(app).get('/');
        console.log('Received response for root route', res.statusCode, res.text);
        
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Piazza API is running!');
    });
});

afterAll(async () => {
    console.log('Running afterAll for app tests');
    await mongoose.connection.close();
});
