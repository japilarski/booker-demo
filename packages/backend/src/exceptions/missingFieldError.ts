export class MissingFieldError extends Error {
  public statusCode = 400;
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}
