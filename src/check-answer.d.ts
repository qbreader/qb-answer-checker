export type CheckDirective = 'accept' | 'prompt' | 'reject';

export interface CheckResult {
  directive: CheckDirective;
  directedPrompt?: string;
}

declare function checkAnswer(
  answerline: string,
  givenAnswer: string,
  strictness?: number,
  verbose?: boolean
): CheckResult;

export default checkAnswer;
export { checkAnswer };
