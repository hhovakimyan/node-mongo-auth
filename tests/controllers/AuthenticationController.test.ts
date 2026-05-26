import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';

import UserRepository from '#repositories/UserRepository';

import app from '../../src/init';

const testUser = {
    firstName: 'Hayk',
    lastName: 'Adamyan',
    email: 'hayk.adamyan@mailinator.com',
    password: '12345678',
};

beforeAll(async () => {
    const userRepo = new UserRepository();
    const instance = await userRepo.getInstance();
    await instance.deleteAllUsers();
});

afterAll(async () => {
    await mongoose.disconnect();
});

test('Registration endpoint works correct', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send({
            ...testUser,
            passwordConfirm: testUser.password,
        })
        .expect(201);

    expect(response.body.token).toBeTruthy();
});

test('Login endpoint authenticates user with correct credentials', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password,
        })
        .expect(200);

    expect(response.body.token).toBeTruthy();
});

test('Login endpoint fails authenticate user incorrect password', async () => {
    await request(app)
        .post('/auth/login')
        .send({
            email: 'nonexistent@mailinator.com',
            password: testUser.password,
        })
        .expect(401);
});

test('Login endpoint fails authenticate user incorrect email', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await request(app)
        .post('/auth/login')
        .send({
            email: testUser.email,
            password: 'Wrongpassword',
        })
        .expect(401);
});
