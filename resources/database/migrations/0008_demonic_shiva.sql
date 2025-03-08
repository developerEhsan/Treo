PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`content` blob NOT NULL,
	`labels` blob,
	`createdAt` integer NOT NULL,
	`updatedAt` integer DEFAULT 1740926069220 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "title", "description", "favorite", "content", "labels", "createdAt", "updatedAt") SELECT "id", "title", "description", "favorite", "content", "labels", "createdAt", "updatedAt" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `notes_id_unique` ON `notes` (`id`);--> statement-breakpoint
ALTER TABLE `clipboard` ADD `updatedAt` integer DEFAULT 1740926069220 NOT NULL;