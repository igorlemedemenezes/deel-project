const request = require('supertest');
const app = require('../../src/app');

describe('Deposit into balance endpoint', () => {
    it('should return 400 if amount is not a number', async () => {
        const response = await request(app)
            .post('/balances/deposit/123')
            .send({ amount: 'notANumber' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Amount is not a valid number or it is not present');
    });

    it('should return 400 if amount is not present', async () => {
        const response = await request(app)
            .post('/balances/deposit/123')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Amount is not a valid number or it is not present');
    });

    it('should return 400 if userId is not provided', async () => {
        const response = await request(app)
            .post('/balances/deposit/')
            .send({ amount: 100 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The userId is required');
    });

    it('should return 500 if an error occurs during deposit', async () => {
        const response = await request(app)
            .post('/balances/deposit/999') // Non-existent userId
            .send({ amount: 100 });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });

    it('should return 200 and the updated balance if deposit is successful', async () => {
        const response = await request(app)
            .post('/balances/deposit/123')
            .send({ amount: 50 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('balance');
    });
});