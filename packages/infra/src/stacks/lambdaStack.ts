import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
  appointmentTable: ITable;
  userPoolClient: UserPoolClient;
  userPool: UserPool;
}

export class LambdaStack extends Stack {
  public appointmentLambdaIntegration!: LambdaIntegration;
  public signUpLambdaIntegration!: LambdaIntegration;
  public logInLambdaIntegration!: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.createAppointmentLambda(props);
    this.createSignUpLambda(props);
    this.createLogInLambda(props);
  }

  private createSignUpLambda(props: LambdaStackProps) {
    const singUpLambda = new NodejsFunction(this, 'signUpLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', '..', 'lambda-handlers', 'src', 'authorization', 'signUpHandler.ts'),
      environment: {
        CLIENT_ID: props.userPoolClient.userPoolClientId,
      },
    });

    singUpLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.userPool.userPoolArn],
        actions: ['cognito-idp:SignUp'],
      })
    );

    this.signUpLambdaIntegration = new LambdaIntegration(singUpLambda);
  }

  private createLogInLambda(props: LambdaStackProps) {
    const logInLambda = new NodejsFunction(this, 'logInLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', '..', 'lambda-handlers', 'src', 'authorization', 'logInHandler.ts'),
      environment: {
        CLIENT_ID: props.userPoolClient.userPoolClientId,
      },
    });

    logInLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.userPool.userPoolArn],
        actions: ['cognito-idp:InitiateAuth'],
      })
    );

    this.logInLambdaIntegration = new LambdaIntegration(logInLambda);
  }

  private createAppointmentLambda(props: LambdaStackProps) {
    const appointmentLambda = new NodejsFunction(this, 'appointmentLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', '..', 'lambda-handlers', 'src', 'appointment', 'appointmentHandler.ts'),
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
