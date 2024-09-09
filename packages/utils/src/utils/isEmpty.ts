import { parseJSON } from './parseJSON';

export function isEmpty<arrayType>(value: arrayType[] | object | string): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'string') {
    value = parseJSON<object>(value);
  }

  return Object.keys(value).length === 0;
}
