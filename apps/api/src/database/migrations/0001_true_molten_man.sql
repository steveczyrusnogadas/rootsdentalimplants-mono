CREATE TABLE "location" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"street" text NOT NULL,
	"suite" text,
	"city" text NOT NULL,
	"region" text NOT NULL,
	"postal_code" text NOT NULL,
	"phone" text NOT NULL,
	"weekly_hours" jsonb NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"sort_order" integer NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_default_call" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "location_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "location_one_default_call" ON "location" USING btree ("is_default_call") WHERE "location"."is_default_call" = true;--> statement-breakpoint
CREATE INDEX "location_sort_order_idx" ON "location" USING btree ("sort_order");