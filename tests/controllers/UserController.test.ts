import request from 'supertest';

import app from '../../src/init';

const myDummyToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNmExNTU2ZWYwZTc4MmY3YjY5MTMyNTdjIiwiaWF0IjoxNzc5Nzg0MjQ0LCJleHAiOjE3ODE5NDQyNDR9.TdhuHgCe6tus0a8sPSk8qoEv5Xpr3ytJOpZSlS7SbKA';
const authenticatedAgent = request.agent(app).set('Authorization', `Bearer ${myDummyToken}`);

test('Get profile runs successfully', async () => {
    const response = await authenticatedAgent.get('/users/me').send().expect(200);
    expect(response.body).toMatchObject({
        data: {
            _id: '6a1556ef0e782f7b6913257c',
            firstName: 'Hayk',
            lastName: 'Adamyan',
            email: 'hayk.adamyan@mailinator.com',
        },
    });
});
