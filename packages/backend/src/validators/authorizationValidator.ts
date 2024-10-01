import { MissingFieldError } from '../exceptions/missingFieldError';
import { AuthorizationRequest } from '../types/authorizationRequest';

export class AuthorizationValidator {
  public validate(authRequest: AuthorizationRequest): void {
    if (!authRequest.email) {
      throw new MissingFieldError('email');
    }
    if (!authRequest.password) {
      throw new MissingFieldError('password');
    }
  }
}
