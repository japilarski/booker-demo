import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { JsonError } from '@booker-demo/utils';
import { MissingFieldError, AppointmentController, RequiredFieldError, NotFountError } from '@booker-demo/backend';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log('dzialam')
  const ddbClient = new DynamoDBClient({});
  const appointmentController = new AppointmentController(ddbClient);

  try {
    return await appointmentController.switch(event);
  } catch (error) {
    if (
      error instanceof JsonError ||
      error instanceof NotFountError ||
      error instanceof MissingFieldError ||
      error instanceof RequiredFieldError
    ) {
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }

    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
  }

  return {
    statusCode: 500,
    body: 'Unexpected AppointmentHandler error. ',
  };
}
