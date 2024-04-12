const request = require('supertest');
const app = require('../../src/app');

describe('Job routes', () => {
    it('should return the list of unpaid jobs for the authenticated profile', async () => {
        const response = await request(app)
            .get('/jobs/unpaid')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return 404 if profile is not found', async () => {
        const response = await request(app)
            .get('/jobs/unpaid')
            .set('Authorization', 'Bearer invalid-access-token');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Profile not found');
    });

    it('should return the payment status after paying for a job', async () => {
        const response = await request(app)
            .post('/jobs/123/pay')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('paymentStatus');
    });

    it('should return 404 if profile is not found while paying for a job', async () => {
        const response = await request(app)
            .post('/jobs/123/pay')
            .set('Authorization', 'Bearer invalid-access-token');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Profile not found');
    });

    it('should return 400 if job id is not provided while paying for a job', async () => {
        const response = await request(app)
            .post('/jobs/pay')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Job id is required');
    });

    it('should return an error status if payment fails for a job', async () => {
        const response = await request(app)
            .post('/jobs/invalid-job-id/pay')
            .set('Authorization', 'Bearer your-access-token');

        expect(response.status).not.toBe(200);
        expect(response.body).toHaveProperty('error');
    });
});
