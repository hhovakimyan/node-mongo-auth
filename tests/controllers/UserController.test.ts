import request from 'supertest';

import app from '../../src/init';

const myDummyToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNmEwNWMzZjUxOGQ4MGViNzkzNzlhNzMyIiwiaWF0IjoxNzc5NzE2ODE0LCJleHAiOjgwMTc3OTcxNjgxNH0.YBnsvwhaSjlvgqyc7tYEZkdi1EPPC47MF-ADnhDgS90';
const authenticatedAgent = request.agent(app).set('Authorization', `Bearer ${myDummyToken}`);

test('Get profile runs successfully', async () => {
    const response = await authenticatedAgent.get('/users/me').send().expect(200);
    expect(response.body).toMatchObject({
        data: {
            _id: '6a05c3f518d80eb79379a732',
            firstName: 'Hayk',
            lastName: 'Adamyan',
            email: 'hayk.adamyan@mailinator.com',
        },
    });
});
