import { extractWords } from "./extractWords";
import { toString } from "./toString";

export function toSnakeCase(string: string) {
  return extractWords(toString(string).replace(/['\u2019]/g, '')).reduce(
    (result, word, index) => result + (index ? '_' : '') + word.toLowerCase(),
    '',
  );
}