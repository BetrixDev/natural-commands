import { createScorer } from "evalite";

export const outputIsOneOfExpected = createScorer<string, string, string[]>({
  name: "Output is one of expected",
  scorer: ({ output, expected }) => {
    return {
      score: (expected ?? []).includes(output) ? 1 : 0,
    };
  },
});

export const outputMatchesExpectedRegex = createScorer<string, string, RegExp>({
  name: "Output matches expected regex",
  scorer: ({ output, expected }) => {
    return {
      score: expected !== undefined && output.match(expected) ? 1 : 0,
    };
  },
});
