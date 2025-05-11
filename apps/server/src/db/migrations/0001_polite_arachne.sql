CREATE TABLE `server_connection` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`token_generated_at` integer NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `server_connection_id_index` ON `server_connection` (`id`);--> statement-breakpoint
CREATE INDEX `server_connection_author_id_index` ON `server_connection` (`author_id`);--> statement-breakpoint
CREATE INDEX `server_connection_created_at_index` ON `server_connection` (`created_at`);