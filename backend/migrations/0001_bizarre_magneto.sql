ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "fan";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "fin";