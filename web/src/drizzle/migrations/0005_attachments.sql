ALTER TABLE "tasks" ADD COLUMN "approved_by_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"reference_model" text NOT NULL,
	"category" text NOT NULL,
	"uploaded_by_id" uuid NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attachments.reference_id_index" ON "attachments" USING btree ("reference_id","reference_model","category");
