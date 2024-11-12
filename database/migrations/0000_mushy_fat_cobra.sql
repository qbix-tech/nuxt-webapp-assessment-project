CREATE TABLE `object` (
	`key` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`bucket` text NOT NULL,
	`name` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`owner` text,
	FOREIGN KEY (`owner`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_bucket_object` ON `object` (`bucket`,`name`);--> statement-breakpoint
CREATE TABLE `one_time_password` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`type` text DEFAULT 'SIGNUP' NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expired_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `url` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text,
	`url` text NOT NULL,
	`short_code` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'link' NOT NULL,
	`image_object` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`image_object`) REFERENCES `object`(`key`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `url_shortCode_unique` ON `url` (`short_code`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`email` text NOT NULL,
	`email_confirmed_at` integer,
	`name` text NOT NULL,
	`hashed_password` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);