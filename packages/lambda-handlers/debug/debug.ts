import {handler} from '../src/appointmentHandler'

const response = handler({
    httpMethod: 'GET',

  } as any, {} as any
);

console.log(response)
