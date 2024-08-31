import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '@booker-demo/utils';

export class DataStack extends Stack {
  public readonly appointmentTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.appointmentTable = new Table(this, 'AppointmentTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `AppointmentTable-${getSuffixFromStack(this)}`,
    });
  }
}
