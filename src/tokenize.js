import numberToWords from 'number-to-words';
import { toArabic } from 'roman-numerals';

const { toWords } = numberToWords;

const typoCorrections = {
  сontainor: 'container',
  сontainors: 'containers',
  сontains: 'contains',
  contentinal: 'continental',
  évaluate: 'evaluate',
  mittani: 'mitanni',
  ludmilla: 'lyudmila',
  grandma: 'grandmother',
  grandpa: 'grandfather',
  sulayman: 'solomon'
};

const ordinalConversions = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
  '5th': 'fifth',
  '6th': 'sixth',
  '7th': 'seventh',
  '8th': 'eighth',
  '9th': 'ninth',
  '10th': 'tenth',
  '11th': 'eleventh',
  '12th': 'twelfth',
  '13th': 'thirteenth',
  '14th': 'fourteenth',
  '15th': 'fifteenth',
  '16th': 'sixteenth',
  '17th': 'seventeenth',
  '18th': 'eighteenth',
  '19th': 'nineteenth',
  '20th': 'twentieth',
  '30th': 'thirtieth',
  '40th': 'fortieth',
  '50th': 'fiftieth',
  '60th': 'sixtieth',
  '70th': 'seventieth',
  '80th': 'eightieth',
  '90th': 'ninetieth'
};

const honorificConversions = {
  dr: 'doctor',
  st: 'saint',
  mr: 'mister',
  mrs: 'missus',
  ms: 'miss',
  esq: 'esquire',
  jr: 'junior',
  sr: 'senior',
  rev: 'reverend',
  fr: 'father',
  prof: 'professor',
  hon: 'honorable',
  pres: 'president',
  vp: 'vice president',
  gov: 'governor',
  ofc: 'officer',
  pr: 'pastor',
  br: 'brother',
  rep: 'representative',
  // 'M': 'Monsieur', this might convert things that are not honorifics.
  Mme: 'Madame',
  Mlle: 'Mademoiselle',
  Hr: 'Herr',
  Fr: 'Frau'
};

// XXX: There will most definatly be cases where this dictionary might erroneously convert a non-unit word to a unit.
// For example, "in" could be a preposition or an abbreviation for "inch".
// As a concequence, some single letter abbeviations are commented out for now.
const unitConversions = {
  // SI units
  // 's': 'second',
  // 'm': 'metere',
  kg: 'kilogram',
  mol: 'mole',
  cd: 'candela',
  // 'A': 'ampere',
  // 'K': 'kelvin',
  // 22 Derived units
  Hz: 'hertz',
  // 'N': 'newton',
  Pa: 'pascal',
  rad: 'radian',
  // 'sr': 'steradian',
  W: 'watt',
  // 'C': 'coulomb', // might be speed of light?
  J: 'joule',
  V: 'volt',
  Wb: 'weber',
  F: 'farad',
  Ohm: 'ohm',
  Ω: 'ohm',
  // 'S': 'siemens',
  kat: 'katal',
  lm: 'lumen',
  lx: 'lux',
  Bq: 'becquerel',
  Gy: 'gray',
  Sv: 'sievert',
  // imperical units
  in: 'inch',
  ft: 'foot',
  yd: 'yard',
  mi: 'mile',
  nmi: 'nautical mile',
  sqmi: 'square mile',
  gal: 'gallon',
  qt: 'quart',
  pt: 'pint',
  cup: 'cup'
};

// very humourous, in'it?
const britishConversions = {
  colour: 'color',
  flavour: 'flavor',
  humour: 'humor',
  labour: 'labor',
  neighbour: 'neighbor',
  odour: 'odor',
  organize: 'organise',
  leukaemia: 'leukemia',
  manoeuvre: 'maneuver',
  oestrogen: 'estrogen',
  paediatric: 'pediatric'
};

const muhammadConversions = {
  muhammed: 'muhammad',
  muhamad: 'muhammad',
  mohammad: 'muhammad',
  mohammed: 'muhammad',
  mahammad: 'muhammad',
  maxammed: 'muhammad',
  mehemmed: 'muhammad',
  mohamad: 'muhammad',
  mohamed: 'muhammad'
};

/**
 * Tries to interpret token as a roman numeral and convert it to a word.
 * @param {string} token
 */
function romanToWord (token) {
  try {
    token = toArabic(token);
  } catch (e) {
    if (e.message !== 'toArabic expects a valid roman number' && !(e instanceof TypeError)) {
      throw e;
    } else {
      return token;
    }
  }
  return toWords(token);
}

/**
 * Generates standardized tokens from a string.
 * @param {string} string
 * @param {boolean} sort - Whether to sort the tokens alphabetically before returning.
 */
export default function tokenize (string, sort = false) {
  const tokens = string.split(' ').filter(token => token.length > 0);

  for (let i = 0; i <= tokens.length - 1; i++) {
    if (Object.prototype.hasOwnProperty.call(ordinalConversions, tokens[i])) {
      tokens[i] = ordinalConversions[tokens[i]];
    }

    if (Object.prototype.hasOwnProperty.call(honorificConversions, tokens[i])) {
      tokens[i] = honorificConversions[tokens[i]];
    }

    if (Object.prototype.hasOwnProperty.call(unitConversions, tokens[i])) {
      tokens[i] = unitConversions[tokens[i]];
    }

    if (Object.prototype.hasOwnProperty.call(britishConversions, tokens[i])) {
      tokens[i] = britishConversions[tokens[i]];
    }

    if (Object.prototype.hasOwnProperty.call(typoCorrections, tokens[i])) {
      tokens[i] = typoCorrections[tokens[i]];
    }

    if (Object.prototype.hasOwnProperty.call(muhammadConversions, tokens[i])) {
      tokens[i] = muhammadConversions[tokens[i]];
    }

    if (tokens[i].endsWith('s') && tokens[i].length > 1 && isFinite(tokens[i].at(-2))) {
      tokens[i] = tokens[i].slice(0, -1);
    }

    tokens[i] = romanToWord(tokens[i]);

    if (isFinite(tokens[i])) {
      tokens[i] = parseInt(tokens[i]);
      tokens[i] = tokens[i] <= 100 ? toWords(tokens[i]) : tokens[i].toString();
    }
  }

  return tokens.sort();
}
