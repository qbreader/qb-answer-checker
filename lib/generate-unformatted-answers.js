import loadCSVAsDict from './load-csv-as-dict.js';
import * as utils from './utils.js';

const equivalentAnswers = loadCSVAsDict('equivalent-answers.csv');

/**
 * Get the abbreviation of a string by taking the first letter of each word.
 * For example, "World Health Organization" becomes "WHO".
 * @param {string} string
 * @returns {string}
 */
function getAbbreviation (string) {
  return string
    .split(' ')
    .filter(token => token.length > 0)
    .map(token => utils.removeHTMLTags(token).charAt(0))
    .reduce((a, b) => a + b, '')
    .trim();
}

/**
 * @param {string} formattedAnswer
 * @param {boolean} isMainAnswer
 * @returns {string[]}
 */
export default function generateUnformattedAnswers (formattedAnswer, isMainAnswer) {
  if (/-/.test(formattedAnswer)) {
    const object1 = generateUnformattedAnswers(formattedAnswer.replace(/-/g, ' '), isMainAnswer);
    const object2 = generateUnformattedAnswers(formattedAnswer.replace(/-/g, ''), isMainAnswer);
    return [...object1, ...object2];
  }

  const answers = [
    utils.removeHTMLTags(formattedAnswer),
    utils.extractUnderlining(formattedAnswer),
    utils.extractKeyWords(formattedAnswer),
    utils.extractQuotes(formattedAnswer)
  ];

  if (isMainAnswer) {
    answers.push(getAbbreviation(formattedAnswer));
    answers.push(getAbbreviation(utils.extractUnderlining(formattedAnswer)));
  }

  if (answers[0] in equivalentAnswers) {
    answers.push(...equivalentAnswers[answers[0]]);
  }

  return answers.map(answer => utils.removePunctuation(answer));
}
