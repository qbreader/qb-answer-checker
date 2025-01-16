export function checkAnswer(
    answerline: string,
    givenAnswer: string,
    strictness?: number,
    verbose?: boolean
): {
    directive: "accept" | "prompt" | "reject";
    directedPrompt?: string;
};
