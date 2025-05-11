CREATE UNIQUE INDEX `server_connection_token_unique` ON `server_connection` (`token`);--> statement-breakpoint
CREATE INDEX `server_connection_token_index` ON `server_connection` (`token`);