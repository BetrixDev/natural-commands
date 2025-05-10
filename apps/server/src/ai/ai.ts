import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { traceAISDKModel } from "evalite/ai-sdk";
import { teleportCommandTool } from "./tools/commands/teleport-command";

type CommandGenerationPrompt = {
  prompt: string;
  minecraftVersion?: string;
  playerName?: string;
  playerUuid?: string;
};

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function generateCommandFromPrompt(
  prompt: CommandGenerationPrompt,
) {
  const minecraftVersion = prompt.minecraftVersion ?? "1.21.1";
  const playerName = prompt.playerName ?? "N/A";
  const playerUuid = prompt.playerUuid ?? "N/A";

  const { text, usage } = await generateText({
    model: traceAISDKModel(openrouter("google/gemini-2.5-flash-preview")),
    system: `You are an AI specialized in generating Minecraft: Java Edition commands.
      Your primary function is to translate user requests from plain English into valid Minecraft commands.
      
      Guidelines:
      1. Output only the command itself, without any explanations or the leading slash (/).
      2. Generate exactly one command per request.
      3. If a request cannot be fulfilled with a single command, return nothing.
      4. Ensure all NBT data in commands is accurate and properly formatted.
      5. Use only commands compatible with Minecraft version ${minecraftVersion}.
      6. Utilize available tools for command generation when applicable.
      7. Do not use aliases for commands.
      
      Context:
      - User's name: ${playerName}
      - User's UUID: ${playerUuid}
      
      When processing requests:
      - Analyze the user's intent carefully.
      - Consider command syntax, parameters, and limitations.
      - Prioritize efficiency and accuracy in command construction.
      - If multiple approaches exist, choose the most straightforward and reliable method.
      
      Remember, your goal is to provide precise, executable Minecraft commands that exactly match the user's specifications.`,
    prompt: prompt.prompt,
    maxSteps: 4,
    tools: {
      teleportCommandTool,
    },
  });

  return {
    command: text,
    usage,
  };
}
