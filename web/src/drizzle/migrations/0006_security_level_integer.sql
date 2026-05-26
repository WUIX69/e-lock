ALTER TABLE "users" ALTER COLUMN "security_level" TYPE integer USING CAST(regexp_replace(COALESCE(security_level, '0'), '\D', '', 'g') AS integer);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "security_level" SET NOT NULL;
