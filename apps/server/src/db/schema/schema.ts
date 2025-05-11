import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export * from "./auth";

export const serverConnection = sqliteTable(
  "server_connection",
  {
    id: text().primaryKey(),
    token: text().notNull().unique(),
    tokenGeneratedAt: integer()
      .notNull()
      .$defaultFn(() => Date.now()),
    name: text().notNull(),
    address: text().notNull(),
    authorId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer()
      .notNull()
      .$defaultFn(() => Date.now()),
    updatedAt: integer()
      .notNull()
      .$defaultFn(() => Date.now()),
    isVerified: integer({ mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    index("server_connection_id_index").on(table.id),
    index("server_connection_author_id_index").on(table.authorId),
    index("server_connection_created_at_index").on(table.createdAt),
    index("server_connection_token_index").on(table.token),
  ],
);
