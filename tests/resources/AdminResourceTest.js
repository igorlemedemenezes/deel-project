const request = require('supertest');
const app = require('../../src/app');

describe('Admin routes', () => {
    it('should return the best profession', async () => {
      const response = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2022-01-01', end: '2022-12-31' });
  
      expect(response.status).toBe(200);
      expect(response.body.bestProfession).toBeDefined();
    });
  
    it('should return the best clients', async () => {
      const response = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2022-01-01', end: '2022-12-31', limit: 2 });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  
    it('should return 400 if start or end parameters are missing for best profession', async () => {
      const response = await request(app)
        .get('/admin/best-profession')
        .query({ end: '2022-12-31' });
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Start and end parameters are required');
    });
  
    it('should return 400 if start, end, or limit parameters are missing for best clients', async () => {
      const response = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2022-01-01', end: '2022-12-31' });
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Start, end, and limit parameters are required');
    });
  });