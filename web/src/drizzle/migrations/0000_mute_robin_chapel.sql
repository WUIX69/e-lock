CREATE TYPE "public"."lock_status" AS ENUM('locked', 'unlocked', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'off-site', 'on-leave');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lock_id" uuid NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"triggered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"mac_address" text NOT NULL,
	"status" "lock_status" DEFAULT 'unknown' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "locks_mac_address_unique" UNIQUE("mac_address")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"position" text NOT NULL,
	"security_level" text NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"last_location" text DEFAULT 'N/A',
	"last_active_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_lock_id_locks_id_fk" FOREIGN KEY ("lock_id") REFERENCES "public"."locks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs.lock_id_index" ON "audit_logs" USING btree ("lock_id");--> statement-breakpoint
CREATE INDEX "audit_logs.triggered_at_index" ON "audit_logs" USING btree ("triggered_at");--> statement-breakpoint
CREATE INDEX "users.email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users.employee_id_index" ON "users" USING btree ("employee_id");