ALTER TABLE "task_coworkers" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "task_coworkers.status_index" ON "task_coworkers" USING btree ("status");
