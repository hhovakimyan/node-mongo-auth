import mongoose from 'mongoose';
import request from 'supertest';

import { app, diContainer } from '#bootstrap/init';

const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@mailinator.com',
    password: '12345678',
};

// Minimal 1×1 PNG for avatar upload tests
const validPngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
);

let authToken: string;

beforeAll(async () => {
    const userRepo = diContainer.cradle.userRepository;
    await userRepo.deleteAllUsers();

    const response = await request(app)
        .post('/auth/register')
        .send({ ...testUser, passwordConfirm: testUser.password });

    authToken = response.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
});

// ─── getProfile ───────────────────────────────────────────────────────────────

test('Get profile runs successfully', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

    expect(response.body.data).toMatchObject({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
    });
});

test('Get profile fails without auth token', async () => {
    await request(app).get('/users/me').expect(401);
});

// ─── updateProfile ────────────────────────────────────────────────────────────

test('Update profile updates firstName successfully', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: 'UpdatedFirst' })
        .expect(200);

    expect(response.body.data.firstName).toBe('UpdatedFirst');
});

test('Update profile updates lastName successfully', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ lastName: 'UpdatedLast' })
        .expect(200);

    expect(response.body.data.lastName).toBe('UpdatedLast');
});

test('Update profile updates both fields simultaneously', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: testUser.firstName, lastName: testUser.lastName })
        .expect(200);

    expect(response.body.data).toMatchObject({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
    });
});

test('Update profile fails when body is empty', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
});

test('Update profile fails when an invalid field is provided', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'newemail@mailinator.com' })
        .expect(400);
});

test('Update profile fails without auth token', async () => {
    await request(app).patch('/users/me').send({ firstName: 'UpdatedFirst' }).expect(401);
});

// ─── uploadAvatar ─────────────────────────────────────────────────────────────

test('Upload avatar succeeds with a valid PNG file', async () => {
    const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('avatar', validPngBuffer, 'avatar.png')
        .expect(200);

    expect(response.body.data).toMatchObject({ email: testUser.email });
});

test('Upload avatar fails with an unsupported file type', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('avatar', Buffer.from('not an image'), 'avatar.txt')
        .expect(400);
});

test('Upload avatar fails when file exceeds the 2 MB size limit', async () => {
    const oversizedBuffer = Buffer.alloc(2_000_001);

    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('avatar', oversizedBuffer, 'avatar.png')
        .expect(400);
});

test('Upload avatar fails without auth token', async () => {
    await request(app)
        .post('/users/me/avatar')
        .attach('avatar', validPngBuffer, 'avatar.png')
        .expect(401);
});

// ─── deleteAvatar ─────────────────────────────────────────────────────────────

test('Delete avatar succeeds', async () => {
    await request(app)
        .delete('/users/me/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
});

test('Delete avatar fails without auth token', async () => {
    await request(app).delete('/users/me/avatar').expect(401);
});

// ─── deleteProfile ────────────────────────────────────────────────────────────

test('Delete profile fails without auth token', async () => {
    await request(app).delete('/users/me').expect(401);
});

test('Delete profile succeeds', async () => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${authToken}`).expect(204);
});

test('Delete profile returns 404 when user no longer exists', async () => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${authToken}`).expect(404);
});
