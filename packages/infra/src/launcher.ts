import { App } from 'aws-cdk-lib';
import { ApiStack } from './stacks/apiStack';
import { DataStack } from './stacks/dataStack';
import { LambdaStack } from './stacks/lambdaStack';

const app = new App();

const dataStack = new DataStack(app, 'DataStack');

const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  appointmentTable: dataStack.appointmentTable,
});

new ApiStack(app, 'ApiStack', {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
});
