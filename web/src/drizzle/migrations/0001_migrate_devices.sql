DROP TABLE IF EXISTS "audit_logs" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "locks" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."lock_status";--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('field_controller', 'shunt_trip', 'gateway');--> statement-breakpoint
CREATE TYPE "public"."device_status" AS ENUM('active', 'warning', 'offline');--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" text NOT NULL,
	"type" "device_type" NOT NULL,
	"assigned_machine" text NOT NULL,
	"mac_address" text NOT NULL,
	"is_high_priority" boolean DEFAULT false NOT NULL,
	"signal_strength" integer DEFAULT 0,
	"last_heartbeat_at" timestamp with time zone,
	"status" "device_status" DEFAULT 'offline' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devices_device_id_unique" UNIQUE("device_id"),
	CONSTRAINT "devices_mac_address_unique" UNIQUE("mac_address")
);--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" uuid NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"triggered_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "devices.device_id_index" ON "devices" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "devices.mac_address_index" ON "devices" USING btree ("mac_address");--> statement-breakpoint
CREATE INDEX "audit_logs.device_id_index" ON "audit_logs" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "audit_logs.triggered_at_index" ON "audit_logs" USING btree ("triggered_at");
