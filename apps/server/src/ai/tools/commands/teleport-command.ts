import { tool } from "ai";
import { z } from "zod";
import { entity, rotation, vec3 } from "@/ai/schemas";

export const teleportCommandTool = tool({
  description:
    "Constructs a valid teleport command using the provided parameters.",
  parameters: z.object({
    targets: entity.optional(),
    destination: vec3.or(entity),
    rotation: rotation.optional(),
    facingLocation: vec3.optional(),
    facingEntity: entity.optional(),
  }),
  execute: async ({
    targets,
    destination,
    rotation,
    facingLocation,
    facingEntity,
  }) => {
    let command = "teleport";

    if (targets !== undefined) {
      command += ` ${targets}`;
    }

    if (typeof destination === "string") {
      command += ` ${destination}`;
    } else {
      command += ` ${destination.x} ${destination.y} ${destination.z}`;
    }

    if (rotation) {
      command += ` ${rotation.yaw} ${rotation.pitch}`;
    }

    if (facingLocation) {
      command += ` facing ${facingLocation.x} ${facingLocation.y} ${facingLocation.z}`;
    } else if (facingEntity) {
      command += ` facing entity ${facingEntity}`;
    }

    return command.trim();
  },
});
