CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assets_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "qrcodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"target_url" text NOT NULL,
	"design_json" json NOT NULL,
	"asset_id" uuid,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qrcodes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scan_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qr_code_id" uuid NOT NULL,
	"ip" text NOT NULL,
	"city" text,
	"region" text,
	"country" text,
	"user_agent" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qrcodes" ADD CONSTRAINT "qrcodes_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_events" ADD CONSTRAINT "scan_events_qr_code_id_qrcodes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qrcodes"("id") ON DELETE no action ON UPDATE no action;