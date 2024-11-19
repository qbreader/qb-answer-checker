import { readFileSync } from 'fs';
import { resolve as pathResolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import csv from 'jquery-csv';

/**
 *
 * @param {string} filename
 * @returns {{[key: string]: string[]}}
 */
export default function loadCSVAsDict (filename) {
  const dictionary = {};
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filepath = pathResolve(__dirname, filename);
  const content = readFileSync(filepath, 'utf8');

  for (const [key, ...values] of csv.toArrays(content)) {
    dictionary[key] = values;
  }

  return dictionary;
}
