import checkAnswer from '../lib/check-answer.js';
import * as bcolors from './bcolors.js';

import { assert } from 'chai';
import mocha from 'mocha';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const tests = require('./tests.json');

function errorText(text) {
    // Colors text red
    return `${bcolors.FAIL}${text}${bcolors.ENDC}`;
}

function answerlineTest(group) {
    let successful = 0, total = 0;
    const answerline = group.answerline;
    mocha.describe(`Answerline Test: ${answerline}`, function () {
        group.tests.forEach((test) => {
            const expected = test.directive;
            const givenAnswer = test.given;
            const expectedDirectedPrompt = test.directedPrompt;
            const { directive, directedPrompt } = checkAnswer(answerline, givenAnswer);
            total++;
            // Assertions will *supposedly* auto return when this fails.
            mocha.it('directive check', () => assert.strictEqual(directive, expected, errorText(`directive for ${givenAnswer}`)));
            if (expectedDirectedPrompt || directedPrompt) {
                mocha.it('directive prompt check', () => assert.strictEqual(directedPrompt, expectedDirectedPrompt, errorText(`directive prompt for ${givenAnswer}`)));
            }
            successful++;
        });
    });
    return  { successful, total };
}


function testAnswerType(type, count = -1) {
    let successful = 0, total = 0;
    mocha.describe(`${type} Answer Testing`, function () {
        if (count > 0) {
            tests[type].splice(count);
        }
        tests[type].forEach(function (group) {
            const { successful: s, total: t } = answerlineTest(group);
            successful += s;
            total += t;
        });
    });
    return successful === total;
}

const count = -1;

testAnswerType('formatted', count);
testAnswerType('unformatted', count);
