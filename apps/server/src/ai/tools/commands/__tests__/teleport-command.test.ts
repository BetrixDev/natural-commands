import { teleportCommandTool } from "../teleport-command";

describe("teleport command", () => {
  it("teleports to coordinates", async () => {
    const command = await teleportCommandTool.execute(
      {
        destination: { x: 100, y: 100, z: 100 },
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport 100 100 100");
  });

  it("teleports to entity", async () => {
    const command = await teleportCommandTool.execute(
      {
        destination: "Player1",
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport Player1");
  });

  it("teleports targets to coordinates", async () => {
    const command = await teleportCommandTool.execute(
      {
        targets: "@a",
        destination: { x: 100, y: 100, z: 100 },
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport @a 100 100 100");
  });

  it("teleports targets to entity", async () => {
    const command = await teleportCommandTool.execute(
      {
        targets: "@a",
        destination: "Player1",
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport @a Player1");
  });

  it("teleports targets to coordinates with rotation", async () => {
    const command = await teleportCommandTool.execute(
      {
        targets: "@a",
        destination: { x: 100, y: 100, z: 100 },
        rotation: { yaw: 90, pitch: 0 },
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport @a 100 100 100 90 0");
  });

  it("teleports targets to coordinates facing location", async () => {
    const command = await teleportCommandTool.execute(
      {
        targets: "@a",
        destination: { x: 100, y: 100, z: 100 },
        facingLocation: { x: 200, y: 200, z: 200 },
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport @a 100 100 100 facing 200 200 200");
  });

  it("teleports targets to coordinates facing entity", async () => {
    const command = await teleportCommandTool.execute(
      {
        targets: "@a",
        destination: { x: 100, y: 100, z: 100 },
        facingEntity: "Player1",
      },
      { messages: [], toolCallId: "" },
    );

    expect(command).toBe("teleport @a 100 100 100 facing entity Player1");
  });
});
