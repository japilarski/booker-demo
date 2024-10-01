import { handler } from '../../../src/authorization/signUpHandler';

const response = await handler(
  {
    httpMethod: 'GET',
    body: '{"password": "Pa$$w0rd", "email": "kpilarski21@gmail.com"}',
  } as any,
  {} as any
);

console.log('response: ', JSON.stringify(response));
