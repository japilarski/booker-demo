import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppointmentService } from '../service/appointmentService';

export class AppointmentController {
  constructor(
    private ddbClient: DynamoDBClient,
    private appointmentService: AppointmentService = new AppointmentService(this.ddbClient)
  ) {}

  public async switch(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    switch (event.httpMethod) {
      case 'GET':
        if (!event.queryStringParameters) {
          return this.appointmentService.getAll();
        }

        return await this.appointmentService.get(event);
      case 'POST':
        return await this.appointmentService.post(event);
      case 'DELETE':
        return await this.appointmentService.delete(event);
      default:
        break;
    }

    return {
      statusCode: 500,
      body: 'Unexpected AppointmentController error.',
    };
  }
}
