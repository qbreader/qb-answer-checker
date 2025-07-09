export const DIRECTIVES = {
  accept: ['accept', 'or', 'antiprompt on', 'anti-prompt on', 'antiprompt', 'anti-prompt'],
  prompt: ['prompt on', 'prompt'],
  reject: ['reject', 'do not accept or prompt on', 'do not accept', 'do not prompt on', 'do not prompt']
};
export const DIRECTIVES_FLATTENED = Object.values(DIRECTIVES).flat();

export const SPECIAL_DIRECTIVES = {
  'accept either': ['accept either', 'accept any'],
  'prompt on partial': ['prompt on partial', 'prompt on a partial', 'prompt on either']
};
