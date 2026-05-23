ALTER TYPE "public"."user_role" ADD VALUE 'senior_engineer';--> statement-breakpoint
ALTER TYPE "public"."device_status" ADD VALUE 'maintenance';--> statement-breakpoint
CREATE TABLE "task_coworkers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL
);--> statement-breakpoint
ALTER TABLE "task_coworkers" ADD CONSTRAINT "task_coworkers_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_coworkers" ADD CONSTRAINT "task_coworkers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_coworkers.task_id_index" ON "task_coworkers" USING btree ("task_id");--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "co_worker_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "co_worker_name";
