import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('test for current user details', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
});
