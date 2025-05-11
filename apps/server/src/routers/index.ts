import { db } from "@/db";
import { account } from "@/db/schema/auth";
import { serverConnection } from "@/db/schema/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";
import { TRPCError } from "@trpc/server";

// Running into wierd type issues so this router file isn't how I would like it to be

export const appRouter = router({
  user: {
    getLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
      const accounts = await db.query.account.findMany({
        where: eq(account.userId, ctx.session.user.id),
      });

      return accounts.map((account) => ({
        id: account.id,
        provider: account.providerId,
      })) as { id: string; provider: string }[];
    }),
  },
  serverConnection: {
    addServerConnection: protectedProcedure
      .input(
        z.object({
          serverName: z.string().min(1),
          serverAddress: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const usersCurrentConnections =
          await db.query.serverConnection.findMany({
            where: eq(serverConnection.authorId, ctx.session.user.id),
          });

        const usersCurrentConnectionsCount = usersCurrentConnections.length;

        if (usersCurrentConnectionsCount >= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have reached the maximum number of connections",
          });
        }

        await db.insert(serverConnection).values({
          id: crypto.randomUUID(),
          token: nanoid(36),
          name: input.serverName,
          address: input.serverAddress,
          authorId: ctx.session.user.id,
        });
      }),
    getServerConnectionsForUser: protectedProcedure.query(async ({ ctx }) => {
      const serverConnections = await db.query.serverConnection.findMany({
        where: eq(serverConnection.authorId, ctx.session.user.id),
      });

      return serverConnections.map((serverConnection) => ({
        id: serverConnection.id,
        name: serverConnection.name,
        address: serverConnection.address,
        isVerified: serverConnection.isVerified,
        token: serverConnection.token,
      })) as {
        id: string;
        name: string;
        address: string;
        isVerified: boolean;
        token: string;
      }[];
    }),
    deleteServerConnection: protectedProcedure
      .input(z.object({ connectionId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db
          .delete(serverConnection)
          .where(
            and(
              eq(serverConnection.id, input.connectionId),
              eq(serverConnection.authorId, ctx.session.user.id)
            )
          );
      }),
  },
  getMinecraftServerStatus: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .query(async ({ input }) => {
      const serverConnectionData = await db.query.serverConnection.findFirst({
        where: eq(serverConnection.id, input.connectionId),
      });

      if (!serverConnectionData) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const response = await (
        await fetch(
          `https://api.mcsrvstat.us/3/${serverConnectionData.address}`,
          {
            headers: {
              "User-Agent": "Natural Commands",
            },
          }
        )
      ).json();

      return {
        isOnline: response.online,
        iconBase64: response.icon,
      };
    }),
});

export type AppRouter = typeof appRouter;
