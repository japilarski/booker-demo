import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
  public userPool!: UserPool;
  public userPoolClient!: UserPoolClient;
  private identityPool!: CfnIdentityPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    // this.createAdminsGroup();
    // this.createIdentityPool();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'BookerUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,  // Automatically verify email. Only for dev stage!
      }
    });

    new CfnOutput(this, 'BookerUserPoolId', {
      value: this.userPool.userPoolId,
    });
  }
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('BookerUserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });
    new CfnOutput(this, 'BookerUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, 'BookerAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admins',
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, 'BookerIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
    new CfnOutput(this, 'BookerIdentityPoolId', {
      value: this.identityPool.ref,
    });
  }
}
