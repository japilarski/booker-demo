import { AuthorisationController } from '@booker-demo/backend';
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
  const authorisationController = new AuthorisationController(cognito);

  try {
    console.log('controller')
    return await authorisationController.signUp(event);
  } catch (error) {
    console.log('controller error: ', error)
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: 'Unexpected SignUpHandler error.  ' + error.message,
      };
    }
  }

  return {
    statusCode: 500,
    body: 'Unexpected SignUpHandler error. ',
  };
};
