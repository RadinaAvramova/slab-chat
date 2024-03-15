import { app } from '../src/index.js';
import { AxiosTestInstance, createInstance } from 'axios-test-instance';
import { RequestListener } from 'http';
import test from 'ava';

let client: AxiosTestInstance;

test.before(async () => {
  client = await createInstance(app.attach as RequestListener);
});

test.after(async () => {
  await client.close();
});

test('Should create user', async (t) => {
  const signupResult = await client.post<{
    message: string;
  }>('/api/v1/auth/register', {
    username: 'demo',
    password: 'demo'
  });

  t.is(signupResult.status, 201);
  t.assert(signupResult.data.message.includes('Created user'));

  const loginResult = await client.post<{
    token?: string;
  }>('/api/v1/auth/login', {
    username: 'demo',
    password: 'demo'
  });

  t.is(loginResult.status, 200);
  t.assert(typeof loginResult.data.token !== undefined);
  t.notDeepEqual(loginResult.data.token, '');
});
