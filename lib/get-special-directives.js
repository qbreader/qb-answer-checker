import { SPECIAL_DIRECTIVES } from "./constants.js";

/**
 * @param {string} answerline
 */
export default function getSpecialDirectives(answerline) {
    const directives = [];

    for (const directive of Object.keys(SPECIAL_DIRECTIVES)) {
        for (const phrase of SPECIAL_DIRECTIVES[directive]) {
            if (answerline.includes(phrase)) {
                directives.push(directive);
            }
        }
    }

    return directives;
}
