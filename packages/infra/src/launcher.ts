import { App } from 'aws-cdk-lib';
import { ApiStack } from './stacks/apiStack';
import { DataStack } from './stacks/dataStack';
import { LambdaStack } from './stacks/lambdaStack';
import { AuthStack } from './stacks/authStack';

const app = new App();

const dataStack = new DataStack(app, 'DataStack');

const authStack = new AuthStack(app, 'AuthStack');

const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  appointmentTable: dataStack.appointmentTable,
  userPoolClient: authStack.userPoolClient,
  userPool: authStack.userPool,
});

new ApiStack(app, 'ApiStack', {
  appointmentLambdaIntegration: lambdaStack.appointmentLambdaIntegration,
  signUpLambdaIntegration: lambdaStack.signUpLambdaIntegration,
  logInLambdaIntegration: lambdaStack.logInLambdaIntegration,
  userPool: authStack.userPool,
});
