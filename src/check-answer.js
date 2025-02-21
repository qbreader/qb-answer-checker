import referenceContainsTokens from './contains-tokens.js';
import generateUnformattedAnswers from './generate-unformatted-answers.js';
import getSpecialDirectives from './get-special-directives.js';
import splitIntoSections from './split-into-sections.js';
import splitSectionIntoParsedClauses from './split-section-into-clauses.js';
import tokenize from './tokenize.js';
import * as utils from './utils.js';

/**
 * @param {string} string
 * @returns
 */
function normalizeString (string) {
  return string
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // replace special characters
    .toLowerCase()
    .replace(/\(s\)/g, 's') // standardize (s) -> s
    .replace(/["“‟❝”❞]/g, '"') // replace all types of quotes with the same quote
    .replace(/[\u2018-\u201B]/g, '\'') // replace all types of single quotes with the same quote
    .replace(/\p{Pd}/gu, '-') // replace all dashes with the same dash
    .replace(/[\u00B7\u22C5\u2027]/g, '') // interpuncts
    .replace(/<\/?i>/g, ''); // remove italics
}

/**
 * Check if the given answer matches the answerline.
 * @param {string} answerline
 * @param {string} givenAnswer
 * @param {number} [strictness]
 * @param {boolean} [verbose] - whether to print debug information
 * @returns {{directive: "accept" | "prompt" | "reject", directedPrompt: string | undefined}}
 */
function checkAnswer (answerline, givenAnswer, strictness = 7, verbose = false) {
  if (typeof answerline !== 'string' || typeof givenAnswer !== 'string') {
    return { directive: 'reject', directedPrompt: undefined };
  }

  if (answerline === '' || givenAnswer === '') {
    return { directive: 'reject', directedPrompt: undefined };
  }

  if (typeof strictness !== 'number' || strictness < 0) {
    strictness = 7;
  }

  if (/<b>/.test(answerline) && !/<u>/.test(answerline)) {
    answerline = answerline.replace(/<b>/g, '<u>').replace(/<\/b>/g, '</u>');
  }

  const isFormattedAnswerline = /<u>/.test(answerline);

  answerline = normalizeString(answerline);

  givenAnswer = normalizeString(givenAnswer);
  givenAnswer = utils.removePunctuation(givenAnswer);
  const givenAnswerTokens = tokenize(givenAnswer, true);

  const sections = splitIntoSections(answerline);
  const parsedClauses = sections.flatMap((section, index) => splitSectionIntoParsedClauses(section, index === 0));
  const mainAnswer = parsedClauses[0].formattedAnswers[0];

  if (!isFormattedAnswerline && mainAnswer?.length > 1 && givenAnswer.length === 1 && isNaN(givenAnswer)) {
    return { directive: 'reject' };
  }

  for (const specialDirective of getSpecialDirectives(answerline)) {
    if (specialDirective === 'accept either') {
      parsedClauses.push({ directive: 'accept', formattedAnswers: mainAnswer.split(' ') });
    }

    if (specialDirective === 'prompt on partial') {
      parsedClauses.push({ directive: 'prompt', formattedAnswers: mainAnswer.split(' ') });
    }
  }

  parsedClauses.sort((a, b) => (a.directive === 'reject' ? -1 : 1) - (b.directive === 'reject' ? -1 : 1));

  for (const { directive, formattedAnswers, directedPrompt, isMainAnswer } of parsedClauses) {
    for (const formattedAnswer of formattedAnswers) {
      for (const unformattedAnswer of generateUnformattedAnswers(formattedAnswer, isMainAnswer)) {
        if (unformattedAnswer === '') { continue; }

        const tokens = tokenize(unformattedAnswer, true);
        let matches;

        if (directive === 'reject') {
          matches = unformattedAnswer === givenAnswer;
        } else {
          matches = referenceContainsTokens(
            isFormattedAnswerline ? tokens : givenAnswerTokens,
            isFormattedAnswerline ? givenAnswerTokens : tokens,
            strictness,
            !isFormattedAnswerline,
            true
          );
        }

        if (matches) { return { directive, directedPrompt }; }
      }
    }
  }

  return { directive: 'reject' };
}

export default checkAnswer;
