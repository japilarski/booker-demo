export class RequiredFieldError extends Error {
  public statusCode = 404;
  constructor(missingField: string | string[]) {
    super(`Required field(s): ${missingField.toString()}. `);
  }
}
