CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` blob NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
