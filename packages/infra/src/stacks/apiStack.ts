import { Stack, StackProps } from 'aws-cdk-lib';
import {
  LambdaIntegration,
  RestApi,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
  MethodOptions,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiStackProps extends StackProps {
  appointmentLambdaIntegration: LambdaIntegration;
  signUpLambdaIntegration: LambdaIntegration;
  logInLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const bookerApi = new RestApi(this, 'BookerApi');

    const authoriserOptions = this.createAuthoriser(bookerApi, props.userPool);
    this.addResource(bookerApi, props, authoriserOptions);
  }

  public createAuthoriser(api: RestApi, userPool: IUserPool): MethodOptions {
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
      cognitoUserPools: [userPool],
      identitySource: 'method.request.header.Authorization',
    });
    authorizer._attachToApi(api);

    return {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };
  }

  public addResource(api: RestApi, props: ApiStackProps, authoriserOptions: MethodOptions) {
    const appointmentResource = api.root.addResource('appointment');
    appointmentResource.addMethod('GET', props.appointmentLambdaIntegration, authoriserOptions);
    appointmentResource.addMethod('POST', props.appointmentLambdaIntegration, authoriserOptions);
    appointmentResource.addMethod('PUT', props.appointmentLambdaIntegration, authoriserOptions);
    appointmentResource.addMethod('DELETE', props.appointmentLambdaIntegration, authoriserOptions);

    const logInResources = api.root.addResource('log-in');
    logInResources.addMethod('POST', props.logInLambdaIntegration);

    const signUpResources = api.root.addResource('sign-up');
    signUpResources.addMethod('POST', props.signUpLambdaIntegration);
  }
}
