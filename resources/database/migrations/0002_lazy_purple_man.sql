ALTER TABLE `storage` RENAME TO `clipboard`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clipboard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT 1738552416301 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_clipboard`("id", "type", "content", "createdAt") SELECT "id", "type", "content", "createdAt" FROM `clipboard`;--> statement-breakpoint
DROP TABLE `clipboard`;--> statement-breakpoint
ALTER TABLE `__new_clipboard` RENAME TO `clipboard`;--> statement-breakpoint
PRAGMA foreign_keys=ON;