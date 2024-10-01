import { AuthorizationController, RequiredFieldError } from '@booker-demo/backend';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const cognito = new CognitoIdentityProviderClient();
    const authorizationController = new AuthorizationController(cognito);
    return await authorizationController.logIn(event);
  } catch (error) {
    console.log('jest problem');
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: 'Unexpected LoginHandler error.  ' + error.message,
      };
    }
    return {
      statusCode: 500,
      body: 'Unexpected LoginHandler error. ' + JSON.stringify(error),
    };
  }
};
