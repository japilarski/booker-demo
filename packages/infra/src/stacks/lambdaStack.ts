import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
  appointmentTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly appointmentLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const appointmentLambda = new NodejsFunction(this, 'appointmentLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', '..', 'lambda-handlers', 'src', 'appointmentHandler.ts'),
      environment: {
        APPOINTMENT_TABLE_NAME: props.appointmentTable.tableName,
      },
    });

    appointmentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.appointmentTable.tableArn],
        actions: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:DeleteItem'],
      })
    );

    this.appointmentLambdaIntegration = new LambdaIntegration(appointmentLambda);
  }
}
