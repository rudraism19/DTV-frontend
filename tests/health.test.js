const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', function() {
  it('returns service health', async function() {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('digital-twin-api');
  });
});
