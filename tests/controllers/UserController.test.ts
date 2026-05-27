import mongoose from 'mongoose';
import request from 'supertest';

import { app, diContainer } from '#bootstrap/init';

const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@mailinator.com',
    password: '12345678',
};

let authToken: string;

beforeAll(async () => {
    const userRepo = diContainer.cradle.userRepository;
    await userRepo.deleteAllUsers();

    const response = await request(app)
        .post('/auth/register')
        .send({ ...testUser, passwordConfirm: testUser.password });

    authToken = response.body.token;
});

test('Get profile runs successfully', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send()
        .expect(200);

    expect(response.body.data).toMatchObject({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
