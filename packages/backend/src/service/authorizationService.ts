import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthorizationRequest } from '../types/authorizationRequest';

export class AuthorizationService {
  private clientId: string;
  constructor(
    private cognito: CognitoIdentityProviderClient,
    clientId?: string
  ) {
    this.clientId = clientId ?? (process.env.CLIENT_ID as string);
  }

  public async signUp(authRequest: AuthorizationRequest): Promise<SignUpCommandOutput> {
    return await this.cognito.send(
      new SignUpCommand({
        ClientId: this.clientId,
        Username: authRequest.email,
        Password: authRequest.password,
        UserAttributes: [{ Name: 'email', Value: authRequest.email }],
      })
    );
  }

  public async logIn(authRequest: AuthorizationRequest): Promise<InitiateAuthCommandOutput> {
    console.log('servvice');
    const response = await this.cognito.send(
      new InitiateAuthCommand({
        ClientId: this.clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: authRequest.email,
          PASSWORD: authRequest.password,
        },
      })
    );
    console.log(response);
    return response;
  }
}
