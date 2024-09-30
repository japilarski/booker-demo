import { JsonError } from '../exceptions/jsonError';

export function parseJSON<OutputType>(arg: string): OutputType {
  try {
    return JSON.parse(arg) as OutputType;
  } catch (error) {
    if (error instanceof Error) {
      throw new JsonError(error.message);
    }
    throw new JsonError('unexpected error');
  }
}
