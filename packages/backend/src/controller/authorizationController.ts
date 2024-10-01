import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthorizationService } from '../service/authorizationService';
import { parseJSON } from '@booker-demo/utils';
import { AuthorizationRequest } from '../types/authorizationRequest';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AuthorizationValidator } from '../validators/authorizationValidator';

export class AuthorizationController {
  private authorizationService: AuthorizationService;
  private authorizationValidator: AuthorizationValidator;

  constructor(private cognito: CognitoIdentityProviderClient) {
    this.authorizationService = new AuthorizationService(this.cognito);
    this.authorizationValidator = new AuthorizationValidator();
  }

  public async signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const authRequest = parseJSON<AuthorizationRequest>(event.body ?? '');
    this.authorizationValidator.validate(authRequest);

    const response = await this.authorizationService.signUp(authRequest);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Signed up successfully!', response }),
    };
  }

  public async logIn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const authRequest = parseJSON<AuthorizationRequest>(event.body ?? '');
    // const authRequest = JSON.parse(event.body as string);
    console.log('authRequest1: ', authRequest);
    this.authorizationValidator.validate(authRequest);
    console.log('authRequest2: ', authRequest);

    const response = await this.authorizationService.logIn(authRequest);
    console.log('response from controller', response);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logged in successfully!', response }), //change to -> body: response.Session // (or something like that)
    };
  }
}
