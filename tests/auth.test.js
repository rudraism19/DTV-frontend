const request = require('supertest');
const app = require('../src/app');

describe('Auth flow', function() {
  it('signs up, logs in, and refreshes tokens', async function() {
    const signup = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test.user@example.com', password: 'StrongPass!123', name: 'Test User' });

    expect(signup.status).toBe(201);
    expect(signup.body.accessToken).toBeDefined();

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test.user@example.com', password: 'StrongPass!123' });

    expect(login.status).toBe(200);
    const cookies = login.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const refresh = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookies)
      .send({});

    expect(refresh.status).toBe(200);
    expect(refresh.body.accessToken).toBeDefined();
  });
});
