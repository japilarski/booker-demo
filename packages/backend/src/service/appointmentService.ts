import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { createRandomId, parseJSON, isEmpty } from '@booker-demo/utils';
import { RequiredFieldError } from '../exceptions/requiredFieldError';
import { NotFountError } from '../exceptions/notFountError';
import { AppointmentValidator } from '../validators/appointmentValidator';
import { Appointment } from '../types/appointment';

export class AppointmentService {
  constructor(
    private ddbClient: DynamoDBClient,
    private appointmentValidator: AppointmentValidator = new AppointmentValidator()
  ) {}

  public async get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const appointmentId = event.queryStringParameters?.id;
    if (!appointmentId) {
      throw new RequiredFieldError('id');
    }

    const getItemResponse = await this.ddbClient.send(
      new GetItemCommand({
        TableName: process.env.APPOINTMENT_TABLE_NAME,
        Key: {
          id: { S: appointmentId },
        },
      })
    );

    if (!getItemResponse.Item || isEmpty(getItemResponse.Item)) {
      throw new NotFountError('Appointment');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(getItemResponse.Item)),
    };
  }

  public async getAll(): Promise<APIGatewayProxyResult> {
    const scanResponse = await this.ddbClient.send(
      new ScanCommand({
        TableName: process.env.APPOINTMENT_TABLE_NAME,
      })
    );

    if (!scanResponse.Items || isEmpty(scanResponse.Items)) {
      throw new NotFountError('Appointments');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(scanResponse.Items.map((appointment) => unmarshall(appointment))),
    };
  }

  public async post(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body || isEmpty(event.body)) {
      throw new RequiredFieldError('appointment details');
    }

    const appointment = parseJSON<Appointment>(event.body);
    appointment.id = createRandomId();
    this.appointmentValidator.validate(appointment);

    const result = await this.ddbClient.send(
      new PutItemCommand({
        TableName: process.env.APPOINTMENT_TABLE_NAME,
        Item: marshall(appointment),
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ id: appointment.id, debug: result }),
    };
  }

  public async delete(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const appointmentId = event.queryStringParameters?.id;
    if (!appointmentId) {
      throw new RequiredFieldError('id');
    }

    await this.ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.APPOINTMENT_TABLE_NAME,
        Key: {
          id: { S: appointmentId },
        },
      })
    );

    return {
      statusCode: 200,
      body: `Appointment ${appointmentId} deleted. `,
    };
  }
}
