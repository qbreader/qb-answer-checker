import { toOrdinal } from 'number-to-words';
import { readFileSync } from 'fs';
import { resolve as pathResolve, dirname } from 'path';
import { fileURLToPath } from 'url';

function loadCorrectionsAsDict() {
    const corrections = {};
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const typosPath = pathResolve(__dirname, 'typos.csv');
    const content = readFileSync(typosPath, 'utf8');

    content.split('\n').forEach(line => {
        const [misspelling, ...correction] = line.split(',');
        corrections[misspelling] = correction.join(',');
    });
    return corrections;
}

const typoCorrections = loadCorrectionsAsDict();

/**
 * Given a token, convert it to a standard form when it can be represented in multiple ways.
 * @param {string} token
 * @returns {string}
 */
function standardizeTokens(token) {

    const ordinalConversions = {
        'first': '1st',
        'second': '2nd',
        'third': '3rd',
        'fourth': '4th',
        'fifth': '5th',
        'sixth': '6th',
        'seventh': '7th',
        'eighth': '8th',
        'ninth': '9th',
        'tenth': '10th',
        'eleventh': '11th',
        'twelfth': '12th',
        'thirteenth': '13th',
        'fourteenth': '14th',
        'fifteenth': '15th',
        'sixteenth': '16th',
        'seventeenth': '17th',
        'eighteenth': '18th',
        'nineteenth': '19th',
        'twentieth': '20th',
        'thirtieth': '30th',
        'fortieth': '40th',
        'fiftieth': '50th',
        'sixtieth': '60th',
        'seventieth': '70th',
        'eightieth': '80th',
        'ninetieth': '90th',
    };

    const honorificConversions = {
        'dr': 'doctor',
        'st': 'saint',
        'mr': 'mister',
        'mrs': 'missus',
        'ms': 'miss',
        'esq': 'esquire',
        'jr': 'junior',
        'sr': 'senior',
        'rev': 'reverend',
        'fr': 'father',
        'prof': 'professor',
        'hon': 'honorable',
        'pres': 'president',
        'vp': 'vice president',
        'gov': 'governor',
        'ofc': 'officer',
        'pr': 'pastor',
        'br': 'brother',
        'rep': 'representative',
        // 'M': 'Monsieur', this might convert things that are not honorifics.
        'Mme': 'Madame',
        'Mlle': 'Mademoiselle',
        'Hr': 'Herr',
        'Fr': 'Frau'

    };

    // XXX: There will most definatly be cases where this dictionary might erroneously convert a non-unit word to a unit.
    // For example, "in" could be a preposition or an abbreviation for "inch".
    // As a concequence, some single letter abbeviations are commented out for now.
    const unitConversions = {
        // SI units
        // 's': 'second',
        // 'm': 'metere',
        'kg': 'kilogram',
        'mol': 'mole',
        'cd': 'candela',
        // 'A': 'ampere',
        // 'K': 'kelvin',
        // 22 Derived units
        'Hz': 'hertz',
        // 'N': 'newton',
        'Pa': 'pascal',
        'rad': 'radian',
        // 'sr': 'steradian',
        'W': 'watt',
        // 'C': 'coulomb', // might be speed of light?
        'J': 'joule',
        'V': 'volt',
        'Wb': 'weber',
        'F': 'farad',
        'Ohm': 'ohm',
        'Ω': 'ohm',
        // 'S': 'siemens',
        'kat': 'katal',
        'lm': 'lumen',
        'lx': 'lux',
        'Bq': 'becquerel',
        'Gy': 'gray',
        'Sv': 'sievert',
        // imperical units
        'in': 'inch',
        'ft': 'foot',
        'yd': 'yard',
        'mi': 'mile',
        'nmi': 'nautical mile',
        'sqmi': 'square mile',
        'gal': 'gallon',
        'qt': 'quart',
        'pt': 'pint',
        'cup': 'cup',
    };

    // very humourous, in'it?
    const BritishToAmerican = {
        'colour': 'color',
        'flavour': 'flavor',
        'humour': 'humor',
        'labour': 'labor',
        'neighbour': 'neighbor',
        'odour': 'odor',
        'organize': 'organise',
        'leukaemia': 'leukemia',
        'manoeuvre': 'maneuver',
        'oestrogen': 'estrogen',
        'paediatric': 'pediatric',
    }

    // This is not comprehensive.
    const HyphenatedWords = {
        'Catch 22': 'Catch-22',
        'Mexican American War': 'Mexican-American War',
        'Spanish American War': 'Spanish-American War',
        'Franco-Prussian War': 'Franco-Prussian War',
        'Six Day War': 'Six-Day War',
        'Diels Alder reaction': 'Diels-Alder reaction',
        'Haber Bosch process': 'Haber-Bosch process',
        'Henderson Hasselbalch equation': 'Henderson-Hasselbalch equation',
        'Navier Stokes equations': 'Navier-Stokes equations',
        'Augustin Louis Cauchy': 'Augustin-Louis Cauchy',
        'Cauchy Schwarz inequality': 'Cauchy-Schwarz inequality',
        'Cauchy Riemann equations': 'Cauchy-Riemann equations',
        'Hertzsprung-Russell diagram': 'Hertzsprung-Russell diagram',
        'Jacques Louis David': 'Jacques-Louis David',
        'Pre Raphaelite Brotherhood': 'Pre-Raphaelite Brotherhood',
        'Pierre Auguste Renoir': 'Pierre-Auguste Renoir',
        'Nikolai Rimsky Korsakov': 'Nikolai Rimsky-Korsakov',
        'Rimsky Korsakov': 'Rimsky-Korsakov',
        'Camille Saint Saëns': 'Camille Saint-Saëns',
        'Jean Jacques Rousseau': 'Jean-Jacques Rousseau',
        'Jean Paul Sartre': 'Jean-Paul Sartre',
        'Jean Baptiste Lamarck': 'Jean-Baptiste Lamarck',
        'Tractatus Logico Philosophicus': 'Tractatus Logico-Philosophicus',
        'Claude Levi Strauss': 'Claude Levi-Strauss',
        'Levi Strauss': 'Levi-Strauss',
        'self actualization': 'self-actualization',
        'self actualized': 'self-actualized',
        'self actualizing': 'self-actualizing',
        'Alexandria Ocasio Cortez': 'Alexandria Ocasio Cortez',
        'Ocasio Cortez': 'Ocasio Cortez',
        'Coca Cola': 'Coca-Cola',
        'Jay Z': 'Jay-Z',
    }

    const conversionTables = [ordinalConversions, honorificConversions, unitConversions, typoCorrections, HyphenatedWords, BritishToAmerican];
    // Remove periods from abbriviations.
    const periodlessToken = token.replace(/\./g, '');

    for (const table of conversionTables) {
        if (table[periodlessToken]) {
            return table[periodlessToken];
        }
    }

    const ordinalMatch = token.match(/^(\d+)(st|nd|rd|th)$/);
    if (ordinalMatch) {
        const number = parseInt(ordinalMatch[1], 10);
        return toOrdinal(number);
    }

    return token;
}

export default standardizeTokens;
