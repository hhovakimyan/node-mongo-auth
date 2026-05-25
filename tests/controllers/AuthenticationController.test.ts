import request from 'supertest';

import app from '../../src/init';

test('Login endpoint authenticates user with correct credentials', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send({
            email: 'hayk.adamyan@mailinator.com',
            password: '12345678',
        })
        .expect(200);

    expect(response.body.token).toBeTruthy();
});

test('Login endpoint fails authenticate user with bad credentials', async () => {
    await request(app)
        .post('/auth/login')
        .send({
            email: 'notexisting.user@mailinator.com',
            password: '12345678',
        })
        .expect(401);
});
