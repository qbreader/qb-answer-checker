import { DIRECTIVES_FLATTENED } from "./constants.js";

/**
 * Removes parentheses and square brackets from a string.
 * @param {string} string - The input string.
 * @returns {string} The string with parentheses and square brackets removed.
 */
function removeParentheses(string) {
    return string.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
}


/**
 *
 * @param {string} answerline
 * @returns {string[]} An array of **answer sections**, where the first element is the **main answer section**.
 */
export default function splitIntoSections (answerline) {
    const mainSection = removeParentheses(answerline);

    let bracketSections = answerline.match(/(?<=\[)[^\]]*(?=\])/g) ?? [];
    let parenthesisSections = answerline.match(/(?<=\()[^)]*(?=\))/g) ?? [];

    bracketSections = bracketSections.filter(section => DIRECTIVES_FLATTENED.some(directive => section.startsWith(directive)));
    parenthesisSections = parenthesisSections.filter(section => DIRECTIVES_FLATTENED.some(directive => section.startsWith(directive)));

    return [ mainSection, ...bracketSections, ...parenthesisSections]
};
