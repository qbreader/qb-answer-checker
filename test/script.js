import checkAnswer from '../src/check-answer.js';

import fs from 'fs';
import csv from 'jquery-csv';

function loadTests (filepath) {
  const content = fs.readFileSync(filepath, 'utf-8').split('\n').slice(1);
  return csv.toArrays(content.join('\n'));
}

function runTest (directive, given, directedPrompt, answerline, index) {
  const result = checkAnswer(answerline, given);
  if (result.directedPrompt === undefined) {
    result.directedPrompt = '';
  }

  const passed = result.directive === directive && result.directedPrompt === directedPrompt;
  if (!passed) {
    console.log(`${index}: Expected ${directive}, ${directedPrompt} but got ${result.directive}, ${result.directedPrompt}`);
    console.log(`Given: ${given} Answerline: ${answerline}`);
    checkAnswer(answerline, given, 7, true);
  }
  return passed;
}

/**
 *
 * @param {string[4]} tests
 */
function runTests (tests) {
  const startTime = Date.now();
  let numberPassed = 0;
  for (let index = 0; index < tests.length; index++) {
    const [directive, given, directedPrompt, answerline] = tests[index];
    const passed = runTest(directive, given, directedPrompt, answerline, index + 2);
    if (passed) { numberPassed++; }
  }
  const timeElapsed = Date.now() - startTime;
  const numberFailed = tests.length - numberPassed;
  console.log(`Passed: ${numberPassed}, Failed: ${numberFailed} (${timeElapsed} ms)`);
  return numberFailed;
}

let status = 0;
status += runTests(loadTests('./test/formatted-tests.csv'));
status += runTests(loadTests('./test/unformatted-tests.csv'));

// set status code equal to the number of failed tests
process.exit(status);
