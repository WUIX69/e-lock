CREATE TYPE "public"."notification_category" AS ENUM('safety_alert', 'task_update', 'system_health');--> statement-breakpoint
CREATE TYPE "public"."notification_severity" AS ENUM('critical', 'warning', 'info', 'default');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "notification_category" NOT NULL,
	"severity" "notification_severity" DEFAULT 'default' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_label" text,
	"actor_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications.recipient_id_index" ON "notifications" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "notifications.is_read_index" ON "notifications" USING btree ("is_read");
