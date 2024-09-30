import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthorisationService } from '../service/authorisationService';
import { isEmpty, parseJSON } from '@booker-demo/utils';
import { RequiredFieldError } from '../exceptions/requiredFieldError';
import { AuthorisationRequest } from '../types/authorisationRequest';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export class AuthorisationController {
  private authorisationService: AuthorisationService;

  constructor(private cognito: CognitoIdentityProviderClient) {
    this.authorisationService = new AuthorisationService(this.cognito);
  }

  public async signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body || isEmpty(event.body)) {
      throw new RequiredFieldError(['login', 'password']);
    }

    const authRequest = parseJSON<AuthorisationRequest>(event.body);
    try {
      const response = await this.authorisationService.signUp(authRequest);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User signed up successfully', response }),
      }
    } catch (error) {
      console.log('mam ten error')
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Sign up error: ', error }),
      }
    }
  }

  public async logIn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body || isEmpty(event.body)) {
      throw new RequiredFieldError(['login', 'password']);
    }
    console.log('body: ', event.body)

    // const authRequest = parseJSON<AuthorisationRequest>(event.body);
    // if (!authRequest) {
    //   throw new RequiredFieldError(['login', 'password']);
    // }

    const response = this.authorisationService.logIn({
      email: "kpilarski21@gmail.com",
      password: "Pa$$w0rd"
    });

    // if (!response.Session) {
    //   throw new Error('Authorisation failed - no session recived. ');
    // }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User logged in successfully', data: response }), //change to -> body: response.Session,
    };
  }
}
