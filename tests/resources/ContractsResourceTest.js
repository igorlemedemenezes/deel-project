const request = require('supertest');
const app = require('../../src/app');

describe('Contract endpoints', () => {
    it('should return the contract with the specified id', async () => {
        const response = await request(app)
            .get('/contracts/123')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('terms');
    });

    it('should return 400 if contract id is not provided', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Contract id is required');
    });

    it('should return 404 if profile is not found', async () => {
        const response = await request(app)
            .get('/contracts/123')
            .set('Authorization', 'Bearer invalid-access-token');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Profile not found');
    });

    it('should return the list of contracts for the authenticated profile', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return 500 if an error occurs while fetching contracts', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('Authorization', 'Bearer invalid-access-token');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});
