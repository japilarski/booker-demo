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
    return await this.cognito.send(
      new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: authRequest.email,
          PASSWORD: authRequest.password,
        },
        ClientId: this.clientId,
      })
    );
  }
}
