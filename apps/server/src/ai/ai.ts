import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { traceAISDKModel } from "evalite/ai-sdk";
import { teleportCommandTool } from "./tools/commands/teleport-command";

type CommandGenerationPrompt = {
  prompt: string;
  minecraftVersion?: string;
  playerName?: string;
  playerUuid?: string;
};

export async function generateCommandFromPrompt(
  prompt: CommandGenerationPrompt
) {
  const minecraftVersion = prompt.minecraftVersion ?? "1.21.1";
  const playerName = prompt.playerName ?? "N/A";
  const playerUuid = prompt.playerUuid ?? "N/A";

  const { text, usage } = await generateText({
    model: traceAISDKModel(openai("gpt-4o-mini")),
    system: `You are an expert at writing Minecraft command.
      Your job is to act as a Minecraft command generator.
      The user will ask you to construct a Minecraft command in plain English and you will have to create a valid Minecraft command for them to use that will match their criteria exactly as described.
      You must only output the command and nothing else. Do not include the leading slash in the command.
      Never include more than 1 command in your message.
      If the user requests something that is not possible with 1 command, don't return anything.
      If you are including NBT data in the command, ensure it is correct.
      Only use commands that are supported in Minecraft version ${minecraftVersion}.
      The name of the user is ${playerName}. The UUID of the user is ${playerUuid}.
      If you have a tool available you can call to generate the command, use it and any other tools you have available.`,
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
