import { distance } from 'damerau-levenshtein-js';
import { stemmer } from 'stemmer';

/**
 * Check if all elements of `tokens` are present in `reference`.
 * @param {string[]} tokens
 * @param {string[]} references
 * @param {number} strictness
 * @param {boolean} acceptSubstring
 * @param {boolean} useStemmer
 */
export default function referenceContainsTokens (tokens, references, strictness, acceptSubstring, useStemmer) {
  let index = 0;
  for (const token of tokens) {
    let containsToken = false;
    while (index < references.length) {
      const reference = references[index];
      index++;
      const errors = useStemmer ? distance(stemmer(token), stemmer(reference)) : distance(token, reference);

      if (strictness > 0 && strictness * errors <= reference.length) {
        containsToken = true;
        break;
      }

      if (acceptSubstring && reference.includes(token)) {
        containsToken = true;
        break;
      }

      if (errors === 0) {
        containsToken = true;
        break;
      }
    }

    if (!containsToken) { return false; }
  }

  return true;
}
