import { DIRECTIVES } from './constants.js';
import * as utils from './utils.js';

/**
 * @param {string} clause
 * @returns {{directive: "accept" | "prompt" | "reject", clause: string}}
 */
function getDirective (clause) {
    for (const directive of Object.keys(DIRECTIVES)) {
        for (const phrase of DIRECTIVES[directive]) {
            if (clause.startsWith(phrase)) {
                clause = clause.replace(phrase, '').trim();
                return { directive, clause };
            }
        }
    }

    return { directive: 'accept', clause };
}


/**
 * @param {string} clause
 */
function getDirectedPrompt (clause) {
    for (const key of ['by asking', 'with']) {
        const index = clause.indexOf(key);
        if (index < 0) { continue; }

        const directedPrompt = utils.extractQuotes(clause.slice(index + key.length));
        clause = clause.slice(0, index).trim();
        return { directedPrompt, clause };
    }

    return { clause };
}

/**
 * @param {string} section
 * @param {boolean} isMainAnswer
 */
export default function splitSectionIntoParsedClauses (section, isMainAnswer) {
    const clauses = section.split(';').map(clause => clause.trim());
    const regex = isMainAnswer ? /,? or / : /,? or |, /;
    const parsedClauses = [];

    for (let clause of clauses) {
        let directive;
        ({directive, clause} = getDirective(clause));
        let directedPrompt = undefined;
        if (directive === 'prompt') {
            ({ directedPrompt, clause } = getDirectedPrompt(clause));
        }

        let formattedAnswers = clause.split(regex);
        formattedAnswers = formattedAnswers.map(token => token.trim()).filter(token => token.length > 0);
        parsedClauses.push({ directive, formattedAnswers, directedPrompt, isMainAnswer });
    }

    return parsedClauses;
};
