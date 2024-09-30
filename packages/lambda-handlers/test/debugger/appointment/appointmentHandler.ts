import { handler } from '../../../src/appointment/appointmentHandler';

const response = handler(
  {
    httpMethod: 'GET',
  } as any,
  {} as any
);

console.log(response);
