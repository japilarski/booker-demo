import { handler } from '../../../src/authorization/logInHandler';

const response = await handler(
  {
    httpMethod: 'GET',
    body: '{\"password\": \"Pa$$w0rd\", \"email\": \"qwlwzkdxfwjnoyqogz@hthlm.com\"}',
  } as any,
  {} as any
);

console.log('final response: ', JSON.stringify(response));
