export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export function parseJson(text: string): JsonValue {
  return JSON.parse(text) as JsonValue;
}
