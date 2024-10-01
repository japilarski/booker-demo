import { AuthorizationController, RequiredFieldError } from '@booker-demo/backend';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const cognito = new CognitoIdentityProviderClient();
  if (!cognito) {
    return {
      statusCode: 500,
      body: 'CognitoIdentityServiceProvider Error',
    };
  }

  const authorizationController = new AuthorizationController(cognito);

  try {
    return await authorizationController.logIn(event);
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: 'Unexpected LoginHandler error.  ' + error.message,
      };
    }
  }

  return {
    statusCode: 500,
    body: 'Unexpected LoginHandler error. ',
  };
};
