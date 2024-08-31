export class RequiredFieldError extends Error {
  public statusCode = 400;
  constructor(missingField: string | string[]) {
    super(`Required field(s): ${missingField.toString()}. `);
  }
}
