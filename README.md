# QB Answer Checker

A package to automatically check/judge answers against quizbowl answerlines.
Mostly used in conjunction with [qbreader](https://www.qbreader.org/) to automatically check answers.

## Usage

Import the `checkAnswer` function as the default import from `src/check-answer.js`:

```js
import checkAnswer from "./src/check-answer.js";
checkAnswer("<b><u>1921</u></b>", 1921);
// output: { directive: 'accept', directedPrompt: undefined }
```

If you have installed the repository as an [npm package](https://www.npmjs.com/package/qb-answer-checker), you can directly import the function, as `src/check-answer.js` has been set up as the main entry point of the repository:
```js
import checkAnswer from "qb-answer-checker";
```

Alternatively, use a CDN like [JSDelivr](https://www.jsdelivr.com/) to serve the site to a browser:

```js
import checkAnswer from "https://cdn.jsdelivr.net/npm/qb-answer-checker/dist/main.mjs";
```

**Note:** [According to webpack](https://webpack.js.org/configuration/output/#module-definition-systems), this feature is still experimental, but it seems to work fine in modern browsers.

## Answerline Specification

This section specifies the kind of (quizbowl) answerlines that the program is designed to parse.

**Answerlines** should be formatted as follows:

```
<main section> [<sub-section>] [<sub-section>]? ...
```

where each **section** is a string of **clauses** separated by semicolons of the form:

```
(<special directives>;)? <clause> (; <clause>; ...)?
```

where each **clause** is a string of answers separated by the word "or" of the form:

```
<directive>? (on)? <answer>((or|,) <answer>(or|,) <answer> ...)? (by asking|with <directed prompt>)?
```

**Deprecated:** answers can also be separated by commas instead of "or", but this is deprecated and serves mostly to support old answerlines.

Each **directive** should be one of:

- "accept"
- "prompt"
- "reject"
- "anti-prompt"
  - some sets use "antiprompt" (no hyphen)

and "on" and "by asking/with" are optional and indicate that there should be a directed prompt.

### Special Directives

**Special directives** should be one of the following and affect the main answerline only:

- "accept either" or "accept any": accept any individual word of the main answer
  - For example, if the entire answerline is `<b><u>Grover Underwood</u></b> [accept either]`, then "Grover", "Underwood", and "Grover Underwood" would be accepted.
- "prompt on partial": prompt on any individual word of the main answer
  - For example: `<b><u>John</u></b> [prompt on partial]` would prompt on "John" and "John Smith", but not "John Smithson".

**Note:** special directives should be the first phrase in the sub-answerline, but this program will recognize them anywhere in the sub-answerline.

### Additional Info

For more information about how answerlines should be formatted, see <https://minkowski.space/quizbowl/manuals/style/answerlines.html>.
Note that the linked guide is more useful for explaining how answerlines should be formatted from a sylistic/quizbowl sense, while this specification only describes how they should be formatted in a way that computers can understand.
