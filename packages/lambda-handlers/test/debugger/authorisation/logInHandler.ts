import { handler } from '../../../src/authorisation/logInHandler';

const response = handler(
  {
    httpMethod: 'GET',
    body: {
      email: "kpilarski21@gmail.com",
      password: "Pa$$w0rd"
    }
  } as any,
  {} as any
);

console.log(response);
