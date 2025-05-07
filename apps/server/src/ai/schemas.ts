import { z } from "zod";

export const vec3 = z
  .object({
    x: z.string().or(z.number()).describe("The x coordinate."),
    y: z.string().or(z.number()).describe("The y coordinate."),
    z: z.string().or(z.number()).describe("The z coordinate."),
  })
  .describe(
    "Must be three-dimensional coordinates with double-precision floating-point number elements. Accepts tilde and caret notations."
  );

export const entity = z
  .string()
  .describe(
    "Must be a player name, a target selector or a UUID. Each entity argument may place limits on the number of entities (single/multiple) selected or the type of entities (player/any entity) selected. If you are given a list of player names, match the player names with the closest one from the list."
  );

export const rotation = z
  .object({
    yaw: z.string().or(z.number()).describe("The yaw of the rotation."),
    pitch: z.string().or(z.number()).describe("The pitch of the rotation."),
  })
  .describe(
    "Must be a rotation consisting of two double number elements, including yaw and pitch, measured in degrees. Only include this if the user has specified a rotation."
  );
