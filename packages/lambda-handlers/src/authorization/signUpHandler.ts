import { AuthorizationController, MissingFieldError } from '@booker-demo/backend';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const cognito = new CognitoIdentityProviderClient();
    const authorizationController = new AuthorizationController(cognito);
    return await authorizationController.signUp(event);
  } catch (error) {
    if (error instanceof MissingFieldError)
      return {
        statusCode: error.statusCode,
        body: error.message,
      };

    return {
      statusCode: 400,
      body: 'Unexpected error.  ' + JSON.stringify(error),
    };
  }
};
