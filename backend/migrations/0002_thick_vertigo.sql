ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "institution_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "institution_email" varchar(255) NOT NULL;--> statement-breakpoint