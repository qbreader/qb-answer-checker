import referenceContainsTokens from './contains-tokens.js';
import generateUnformattedAnswers from './generate-unformatted-answers.js';
import getSpecialDirectives from './get-special-directives.js';
import splitIntoSections from './split-into-sections.js';
import splitSectionIntoParsedClauses from './split-section-into-clauses.js';
import tokenize from './tokenize.js';
import * as utils from './utils.js';

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

  const isFormattedAnswerline = /<u>/.test(answerline);

  answerline = utils.replaceSpecialCharacters(answerline);
  answerline = answerline.toLowerCase();
  answerline = utils.replaceSpecialSubstrings(answerline);
  answerline = utils.removeItalics(answerline);

  givenAnswer = utils.replaceSpecialCharacters(givenAnswer);
  givenAnswer = givenAnswer.toLowerCase();
  givenAnswer = utils.replaceSpecialSubstrings(givenAnswer);
  givenAnswer = utils.removeItalics(givenAnswer);
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
        const tokens = tokenize(unformattedAnswer, true);

        const matches = referenceContainsTokens(
          isFormattedAnswerline || directive === 'reject' ? tokens : givenAnswerTokens,
          isFormattedAnswerline || directive === 'reject' ? givenAnswerTokens : tokens,
          directive === 'reject' ? -1 : strictness,
          !isFormattedAnswerline,
          directive !== 'reject'
        );

        if (matches) { return { directive, directedPrompt }; }
      }
    }
  }

  return { directive: 'reject' };
}

export default checkAnswer;
