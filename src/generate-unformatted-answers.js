import * as utils from './utils.js';

const elements = {
  hydrogen: ['h'],
  helium: ['he'],
  lithium: ['li'],
  beryllium: ['be'],
  boron: ['b'],
  carbon: ['c'],
  nitrogen: ['n'],
  oxygen: ['o'],
  fluorine: ['f'],
  neon: ['ne'],
  sodium: ['na'],
  magnesium: ['mg'],
  aluminum: ['al'],
  silicon: ['si'],
  phosphorus: ['p'],
  sulfur: ['s'],
  chlorine: ['cl'],
  argon: ['ar'],
  potassium: ['k'],
  calcium: ['ca'],
  scandium: ['sc'],
  titanium: ['ti'],
  vanadium: ['v'],
  chromium: ['cr'],
  manganese: ['mn'],
  iron: ['fe'],
  cobalt: ['co'],
  nickel: ['ni'],
  copper: ['cu'],
  zinc: ['zn'],
  gallium: ['ga'],
  germanium: ['ge'],
  arsenic: ['as'],
  selenium: ['se'],
  bromine: ['br'],
  krypton: ['kr'],
  rubidium: ['rb'],
  strontium: ['sr'],
  yttrium: ['y'],
  zirconium: ['zr'],
  niobium: ['nb'],
  molybdenum: ['mo'],
  technetium: ['tc'],
  ruthenium: ['ru'],
  rhodium: ['rh'],
  palladium: ['pd'],
  silver: ['ag'],
  cadmium: ['cd'],
  indium: ['in'],
  tin: ['sn'],
  antimony: ['sb'],
  tellurium: ['te'],
  iodine: ['i'],
  xenon: ['xe'],
  cesium: ['cs'],
  barium: ['ba'],
  lanthanum: ['la'],
  cerium: ['ce'],
  praseodymium: ['pr'],
  neodymium: ['nd'],
  promethium: ['pm'],
  samarium: ['sm'],
  europium: ['eu'],
  gadolinium: ['gd'],
  terbium: ['tb'],
  dysprosium: ['dy'],
  holmium: ['ho'],
  erbium: ['er'],
  thulium: ['tm'],
  ytterbium: ['yb'],
  lutetium: ['lu'],
  hafnium: ['hf'],
  tantalum: ['ta'],
  tungsten: ['w'],
  rhenium: ['re'],
  osmium: ['os'],
  iridium: ['ir'],
  platinum: ['pt'],
  gold: ['au'],
  mercury: ['hg'],
  thallium: ['tl'],
  lead: ['pb'],
  bismuth: ['bi'],
  polonium: ['po'],
  astatine: ['at'],
  radon: ['rn'],
  francium: ['fr'],
  radium: ['ra'],
  actinium: ['ac'],
  thorium: ['th'],
  protactinium: ['pa'],
  uranium: ['u'],
  neptunium: ['np'],
  plutonium: ['pu'],
  americium: ['am'],
  curium: ['cm'],
  berkelium: ['bk'],
  californium: ['cf'],
  einsteinium: ['es'],
  fermium: ['fm'],
  mendelevium: ['md'],
  nobelium: ['no'],
  lawrencium: ['lr'],
  rutherfordium: ['rf'],
  dubnium: ['db'],
  seaborgium: ['sg'],
  bohrium: ['bh'],
  hassium: ['hs'],
  meitnerium: ['mt'],
  darmstadtium: ['ds'],
  roentgenium: ['rg'],
  copernicium: ['cn'],
  nihonium: ['nh'],
  flerovium: ['fl'],
  moscovium: ['mc'],
  livermorium: ['lv'],
  tennessine: ['ts'],
  oganesson: ['og']
};

const equivalentAnswers = {
  ...elements,
  'atomic bombs': ['atomic weapons', 'nuclear bombs', 'nuclear weapons', 'nukes', 'fission bombs', 'A-bombs'],
  'nuclear weapons': ['atomic bombs', 'atomic weapons', 'nuclear bombs', 'nukes', 'fission bombs', 'A-bombs'],
  nukes: ['atomic bombs', 'atomic weapons', 'nuclear bombs', 'nuclear weapons', 'fission bombs', 'A-bombs'],
  fairytales: ['fairy tales'],
  'fairy tales': ['fairytales'],
  house: ['home', 'dwelling', 'residence'],
  mouse: ['mice'],
  rail: ['railroad'],
  railroad: ['rail'],
  'nineteen eighty-four': ['1984', 'nineteen eighty four'],
  'nineteen eighty four': ['1984', 'nineteen eighty-four'],
  'oxidation number': ['oxidation state'],
  'oxidation state': ['oxidation number'],
  'ralph vaughan-williams': ['rvw'],
  spacewalk: ['space walk'],
  spacewalks: ['space walk'],
  'sugar cane': ['sugarcane'],
  sugarcane: ['sugar cane'],
  wavefunction: ['wave function'],
  'Gulf of Mexico': ['Gulf of America'], 
  'wave function': ['wavefunction'],
  'world war 1': ['first world war', 'great war', 'world war i', 'world war one'],
  'world war i': ['first world war', 'great war', 'world war 1', 'world war one'],
  'world war one': ['first world war', 'great war', 'world war 1', 'world war i'],
  'world war ii': ['ww2', 'wwii', 'world war 2', 'world war two', 'second world war'],
  'world war two': ['ww2', 'wwii', 'world war ii', 'world war 2', 'second world war'],
  'world war 2': ['ww2', 'wwii', 'world war ii', 'world war two', 'second world war'],
  'Kanye West': ['kayne', 'west'],
  superconductors: ['super conductors', 'super conductor'],
  'baha\' i': ['bahai'],
  'united states of america': ['united states', 'usa', 'us', 'america'],
  'the united states of america': ['united states', 'usa', 'us', 'america'],
  usa: ['united states', 'us', 'america']
};

/**
 * Get the abbreviation of a string by taking the first letter of each word.
 * For example, "World Health Organization" becomes "WHO".
 * @param {string} string
 * @returns {string}
 */
function getAbbreviation (string) {
  return string
    .split(' ')
    .filter(token => token.length > 0)
    .map(token => utils.removeHTMLTags(token).charAt(0))
    .reduce((a, b) => a + b, '')
    .trim();
}

/**
 * @param {string} formattedAnswer
 * @param {boolean} isMainAnswer
 * @returns {string[]}
 */
export default function generateUnformattedAnswers (formattedAnswer, isMainAnswer) {
  if (/-/.test(formattedAnswer)) {
    const object1 = generateUnformattedAnswers(formattedAnswer.replace(/-/g, ' '), isMainAnswer);
    const object2 = generateUnformattedAnswers(formattedAnswer.replace(/-/g, ''), isMainAnswer);
    return [...object1, ...object2];
  }

  const answers = [
    utils.removeHTMLTags(formattedAnswer),
    utils.extractUnderlining(formattedAnswer),
    utils.extractKeyWords(formattedAnswer),
    utils.extractQuotes(formattedAnswer)
  ];

  if (isMainAnswer) {
    for (const answer of [formattedAnswer, utils.extractUnderlining(formattedAnswer)]) {
      const abbreviation = getAbbreviation(answer);
      if (abbreviation.length > 1) {
        answers.push(abbreviation);
      }
    }
  }

  if (answers[0] in equivalentAnswers) {
    answers.push(...equivalentAnswers[answers[0]]);
  }

  return answers.map(answer => utils.removePunctuation(answer));
}
