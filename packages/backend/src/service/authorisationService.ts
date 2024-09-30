import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthorisationRequest } from '../types/authorisationRequest';

export class AuthorisationService {
  private clientId: string;
  constructor(
    private cognito: CognitoIdentityProviderClient,
    clientId?: string
  ) {
    this.clientId = clientId ? (process.env.CLIENT_ID as string) : 'ef4c9mi1uan6g181hi2h2jkt';
  }

  public async signUp(authRequest: AuthorisationRequest) {
    try{
      const response = await this.cognito.send(
        new SignUpCommand({
          ClientId: this.clientId,
          Username: authRequest.email,
          Password: authRequest.password,
          UserAttributes: [{ Name: 'email', Value: authRequest.email }],
        })
      );
      console.log('service resposen: ', response)
      return response;
    
    } catch (error) {
      console.log('service error: ', error)
      throw new Error('Sign up unsuccessful!')
    }
  }

  public async logIn(authRequest: AuthorisationRequest) {
    try{
      const response = await this.cognito.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            USERNAME: authRequest.email,
            PASSWORD: authRequest.password,
          },
          ClientId: this.clientId,
        })
      );
      console.log(JSON.stringify(response))
      return response
    
    } catch (error) {
      console.log(JSON.stringify(error))
      throw new Error('Sign up unsuccessful!')
    }
  }
}
