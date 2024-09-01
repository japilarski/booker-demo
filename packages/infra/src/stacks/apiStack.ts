import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  appointmentLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const bookerApi = new RestApi(this, 'BookerApi');
    const appointmentResource = bookerApi.root.addResource('appointment');
    appointmentResource.addMethod('GET', props.appointmentLambdaIntegration);
    appointmentResource.addMethod('POST', props.appointmentLambdaIntegration);
    appointmentResource.addMethod('PUT', props.appointmentLambdaIntegration);
    appointmentResource.addMethod('DELETE', props.appointmentLambdaIntegration);
  }
}
