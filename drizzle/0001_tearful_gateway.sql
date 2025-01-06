CREATE TABLE IF NOT EXISTS "puzzle_completion" (
	"puzzle_id" text NOT NULL,
	"completed_by" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "puzzle" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "puzzle_completion" ADD CONSTRAINT "puzzle_completion_puzzle_id_puzzle_id_fk" FOREIGN KEY ("puzzle_id") REFERENCES "public"."puzzle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "puzzle_completion" ADD CONSTRAINT "puzzle_completion_completed_by_user_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
