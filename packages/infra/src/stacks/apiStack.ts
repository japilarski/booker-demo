import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const bookerApi = new RestApi(this, 'BookerApi');
    const appointmentResource = bookerApi.root.addResource('appointment');
    appointmentResource.addMethod('GET', props.spacesLambdaIntegration);
    appointmentResource.addMethod('POST', props.spacesLambdaIntegration);
    appointmentResource.addMethod('PUT', props.spacesLambdaIntegration);
    appointmentResource.addMethod('DELETE', props.spacesLambdaIntegration);
  }
}
