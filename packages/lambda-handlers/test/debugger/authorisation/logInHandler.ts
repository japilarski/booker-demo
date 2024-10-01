import { handler } from '../../../src/authorization/logInHandler';

const response = handler(
  {
    httpMethod: 'GET',
    body: {
      email: 'kpilarski21@gmail.com',
      password: 'Pa$$w0rd',
    },
  } as any,
  {} as any
);

console.log(response);
