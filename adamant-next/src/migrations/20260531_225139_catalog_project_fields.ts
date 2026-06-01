import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`catalog_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`catalog_gallery_order_idx\` ON \`catalog_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`catalog_gallery_parent_id_idx\` ON \`catalog_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`catalog_gallery_image_idx\` ON \`catalog_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_catalog_v_version_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_catalog_v_version_gallery_order_idx\` ON \`_catalog_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_catalog_v_version_gallery_parent_id_idx\` ON \`_catalog_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_catalog_v_version_gallery_image_idx\` ON \`_catalog_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`catalog\` ADD \`price\` numeric;`)
  await db.run(sql`ALTER TABLE \`catalog\` ADD \`area\` numeric;`)
  await db.run(sql`ALTER TABLE \`catalog\` ADD \`floors\` numeric;`)
  await db.run(sql`ALTER TABLE \`catalog\` ADD \`rooms\` numeric;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` ADD \`version_price\` numeric;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` ADD \`version_area\` numeric;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` ADD \`version_floors\` numeric;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` ADD \`version_rooms\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`catalog_gallery\`;`)
  await db.run(sql`DROP TABLE \`_catalog_v_version_gallery\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`price\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`area\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`floors\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`rooms\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_price\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_area\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_floors\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_rooms\`;`)
}
