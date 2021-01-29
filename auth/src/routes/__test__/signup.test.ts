import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('a 201 status code on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@yopmail.com',
      password: 'abcd.1234'
    })
    .expect(201);
});

it('disallowd duplicate signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@yopmail.com',
      password: 'abcd.1234'
    })
    .expect(201);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@yopmail.com',
      password: 'abcd.1234'
    })
    .expect(400);
});

it('check cookie after signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@yopmail.com',
      password: 'abcd.1234'
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
