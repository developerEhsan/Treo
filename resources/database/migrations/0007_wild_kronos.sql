ALTER TABLE `clipboard` ADD `pinned` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `notes_id_unique` ON `notes` (`id`);