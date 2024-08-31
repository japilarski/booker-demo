export class NotFountError extends Error {
  public statusCode = 404;
  constructor(object?: string) {
    super(`${object ?? 'Object'} not found.`);
  }
}
