import { db } from "@/db";
import { account } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";

export const appRouter = router({
  user: {
    getLinkedAccounts: protectedProcedure
      .output(
        z.array(
          z.object({
            id: z.string(),
            provider: z.string(),
          }),
        ),
      )
      .query(async ({ ctx }) => {
        const accounts = await db.query.account.findMany({
          where: eq(account.userId, ctx.session.user.id),
        });

        return accounts.map((account) => ({
          id: account.id,
          provider: account.providerId,
        }));
      }),
  },
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;
