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
    this.authorizationValidator.validate(authRequest);

    const authenticationResult = await this.authorizationService.logIn(authRequest);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logged in successfully!', authenticationResult }),
    };
  }
}
