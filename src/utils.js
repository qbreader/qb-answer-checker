/**
 * Get all words which are partially or wholly underlined.
 * @param {string} string
 * @returns {string}
 */
function extractKeyWords (string) {
  const requiredWords = extractUnderlining(string).split(' ');

  string = string
    .split(' ')
    .filter(token => token.length > 0)
    .filter(token => token.match(/<\/?u>/) || requiredWords.includes(token))
    .reduce((prev, curr) => prev + curr + ' ', '')
    .trim();

  return removeHTMLTags(string);
}

/**
 * Extracts the text in quotes from a given string.
 * @param {string} string - The input string.
 * @returns {string} - The extracted quotes or the string without HTML tags.
 */
function extractQuotes (string) {
  const matches = string.match(/"[^"]*(?=["])/g)?.map(match => match.slice(1));

  if (matches) {
    return removeHTMLTags(matches.reduce((prev, curr) => prev + ' ' + curr, '').trim());
  } else {
    return removeHTMLTags(string);
  }
}

/**
 * Extracts the underlined text from a string.
 * If no underlined text is found, it removes HTML tags from the string.
 * @param {string} string - The input string.
 * @returns {string} - The extracted underlined text or the string without HTML tags.
 */
function extractUnderlining (string) {
  const matches = string.match(/<u>[^<]*(?=<\/u>)/g)?.map(match => match.slice(3));

  if (matches) {
    return removeHTMLTags(matches.reduce((prev, curr) => prev + curr + ' ', '').trim());
  } else {
    return removeHTMLTags(string);
  }
}

/**
 * Removes HTML tags from a string.
 * @param {string} string
 * @returns {string}
 */
function removeHTMLTags (string) {
  return string.replace(/<[^>]*>/g, '');
}

function removePunctuation (string) {
  return string.replace(/[.,!;:'"\\/?@#$%^&*_~’]/g, '');
}

export {
  extractKeyWords,
  extractQuotes,
  extractUnderlining,
  removeHTMLTags,
  removePunctuation
};
