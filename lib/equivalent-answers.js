import { removeHTMLTags } from './utils.js';


const answerEquivalents = {
        'atomic bombs': ['atomic weapons', 'nuclear bombs', 'nuclear weapons', 'nukes', 'fission bombs', 'A-bombs'],
        'nuclear weapons': ['atomic bombs', 'atomic weapons', 'nuclear bombs', 'nukes', 'fission bombs', 'A-bombs'],
        'nukes': ['atomic bombs', 'atomic weapons', 'nuclear bombs', 'nuclear weapons', 'fission bombs', 'A-bombs'],
        'house': ['home', 'dwelling', 'residence'],
        'mouse': ['mice'],
        'rail': ['railroad'],
        'railroad': ['rail'],
        'nineteen eighty-four': ['1984', 'nineteen eighty four'],
        'nineteen eighty four': ['1984', 'nineteen eighty-four'],
        'oxidation number': ['oxidation state'],
        'oxidation state': ['oxidation number'],
        'ralph vaughan-williams': ['rvw'],
        'spacewalk': ['space walk'],
        'sugar cane': ['sugarcane'],
        'sugarcane': ['sugar cane'],
        'wavefunction': ['wave function'],
        'wave function': ['wavefunction'],
        'world war 1': ['first world war', 'great war', 'world war i', 'world war one'],
        'world war i': ['first world war', 'great war', 'world war 1', 'world war one'],
        'world war one': ['first world war', 'great war', 'world war 1', 'world war i'],
        'world war ii': ['ww2', 'wwii', 'world war 2', 'world war two', 'second world war'],
        'world war two': ['ww2', 'wwii', 'world war ii', 'world war 2', 'second world war'],
        'world war 2': ['ww2', 'wwii', 'world war ii', 'world war two', 'second world war'],
};

/**
 * Given an answer, return an array of equivalent answers (i.e. answers that should always match).
 * @param {string} answer
 * @returns {string[]} An array of equivalent answers.
 */
function getEquivalentAnswers(answer) {

    return answerEquivalents[removeHTMLTags(answer).toLowerCase()] || [];
}

export default getEquivalentAnswers;
