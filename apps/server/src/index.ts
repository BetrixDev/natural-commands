import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono/quick";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { db } from "./db";
import { serverConnection } from "./db/schema/schema";
import { and, eq } from "drizzle-orm";
import { generateCommandFromPrompt } from "./ai/ai";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.post("/v1/serverConnection/:connectionId/verify", async (c) => {
  const { connectionId } = c.req.param();
  const { token } = await c.req.json();

  if (!token || typeof token !== "string" || token === "") {
    return c.json(
      {
        success: false,
        error: "No token provided",
      },
      400
    );
  }

  const connection = await db.query.serverConnection.findFirst({
    where: and(
      eq(serverConnection.token, token),
      eq(serverConnection.id, connectionId)
    ),
  });

  if (!connection) {
    return c.json(
      {
        success: false,
        error: "Invalid token or server id",
      },
      404
    );
  }

  await db
    .update(serverConnection)
    .set({
      isVerified: true,
    })
    .where(eq(serverConnection.id, connectionId));

  return c.json({
    success: true,
    message: "Server connection verified",
  });
});

app.get("/v1/prompt", async (c) => {
  const { prompt } = await c.req.json();

  if (!prompt || typeof prompt !== "string" || prompt === "") {
    return c.json(
      {
        success: false,
        error: "No prompt provided",
      },
      400
    );
  }

  try {
    const { command } = await generateCommandFromPrompt({
      prompt,
    });

    return c.json({
      success: true,
      command,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to generate command. Please try again.",
      },
      500
    );
  }
});

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
