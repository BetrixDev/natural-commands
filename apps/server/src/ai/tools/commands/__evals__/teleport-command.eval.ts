import { generateCommandFromPrompt } from "@/ai/ai";
import { evalite } from "evalite";
import { outputIsOneOfExpected, outputMatchesExpectedRegex } from "./scorers";

evalite("teleport command for self", {
  data: () => [
    {
      input: "Teleport me to the coordinates 100 100 100",
      expected: /^teleport (?:@[ps] )?100 100 100$/,
    },
    {
      input:
        "Teleport me to the coordinates 100 100 100 and facing towards CreeperMan123",
      expected: /^teleport (?:@[ps] )?100 100 100 facing entity CreeperMan123$/,
    },
    {
      input:
        "Teleport me to the coordinates 100 100 100 and facing towards the location 100 100 100",
      expected: /^teleport (?:@[ps] )?100 100 100 facing 100 100 100$/,
    },
  ],
  task: async (input) => {
    const { command } = await generateCommandFromPrompt({
      prompt: input,
    });

    return command;
  },
  scorers: [outputMatchesExpectedRegex],
});

evalite("teleport command for other user", {
  data: () => [
    {
      input: "Teleport BetrixDev to me",
      expected: ["teleport BetrixDev @s", "teleport BetrixDev ~ ~ ~"],
    },
  ],
  task: async (input) => {
    const { command } = await generateCommandFromPrompt({
      prompt: input,
    });

    return command;
  },
  scorers: [outputIsOneOfExpected],
});
