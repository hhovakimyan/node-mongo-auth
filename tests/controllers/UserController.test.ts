import mongoose from 'mongoose';
import request from 'supertest';

import UserRepository from '#repositories/UserRepository';

import app from '../../src/init';

const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@mailinator.com',
    password: '12345678',
};

let authToken: string;

beforeAll(async () => {
    const userRepo = new UserRepository();
    const instance = await userRepo.getInstance();
    await instance.deleteAllUsers();

    const response = await request(app)
        .post('/auth/register')
        .send({ ...testUser, passwordConfirm: testUser.password });

    authToken = response.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
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
