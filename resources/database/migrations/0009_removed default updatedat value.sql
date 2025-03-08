PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clipboard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pinned` integer DEFAULT false NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_clipboard`("id", "pinned", "type", "content", "createdAt", "updatedAt") SELECT "id", "pinned", "type", "content", "createdAt", "updatedAt" FROM `clipboard`;--> statement-breakpoint
DROP TABLE `clipboard`;--> statement-breakpoint
ALTER TABLE `__new_clipboard` RENAME TO `clipboard`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`content` blob NOT NULL,
	`labels` blob,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "title", "description", "favorite", "content", "labels", "createdAt", "updatedAt") SELECT "id", "title", "description", "favorite", "content", "labels", "createdAt", "updatedAt" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
CREATE UNIQUE INDEX `notes_id_unique` ON `notes` (`id`);