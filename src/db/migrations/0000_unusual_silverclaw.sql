CREATE TABLE "machines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "machines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"machine_key" varchar NOT NULL,
	CONSTRAINT "machines_machine_key_unique" UNIQUE("machine_key")
);
--> statement-breakpoint
CREATE TABLE "trays" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tray_barcode" varchar NOT NULL,
	"total_eggs" integer NOT NULL,
	"fertile" integer NOT NULL,
	"infertile" integer NOT NULL,
	"early_death" integer NOT NULL,
	"blood_ring" integer NOT NULL,
	"machine_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "total_eggs_non_negative" CHECK ("trays"."total_eggs" >= 0),
	CONSTRAINT "fertile_non_negative" CHECK ("trays"."fertile" >= 0),
	CONSTRAINT "infertile_non_negative" CHECK ("trays"."infertile" >= 0),
	CONSTRAINT "early_death_non_negative" CHECK ("trays"."early_death" >= 0),
	CONSTRAINT "blood_ring_non_negative" CHECK ("trays"."blood_ring" >= 0)
);
--> statement-breakpoint
ALTER TABLE "trays" ADD CONSTRAINT "trays_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tray_barcode_idx" ON "trays" USING btree ("tray_barcode");