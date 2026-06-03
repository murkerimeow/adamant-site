import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`catalog_advantages\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`text\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_advantages_order_idx\` ON \`catalog_advantages\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_advantages_parent_id_idx\` ON \`catalog_advantages\` (\`_parent_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_catalog_v_version_advantages\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`text\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_advantages_order_idx\` ON \`_catalog_v_version_advantages\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_advantages_parent_id_idx\` ON \`_catalog_v_version_advantages\` (\`_parent_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`catalog_layouts\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`title\` text,
    \`meta\` text,
    \`image_id\` integer,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_layouts_order_idx\` ON \`catalog_layouts\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_layouts_parent_id_idx\` ON \`catalog_layouts\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_layouts_image_idx\` ON \`catalog_layouts\` (\`image_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_catalog_v_version_layouts\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`meta\` text,
    \`image_id\` integer,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_layouts_order_idx\` ON \`_catalog_v_version_layouts\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_layouts_parent_id_idx\` ON \`_catalog_v_version_layouts\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_layouts_image_idx\` ON \`_catalog_v_version_layouts\` (\`image_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_gallery_order_idx\` ON \`portfolio_gallery\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_gallery_parent_id_idx\` ON \`portfolio_gallery\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_gallery_image_idx\` ON \`portfolio_gallery\` (\`image_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_portfolio_v_version_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_gallery_order_idx\` ON \`_portfolio_v_version_gallery\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_gallery_parent_id_idx\` ON \`_portfolio_v_version_gallery\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_gallery_image_idx\` ON \`_portfolio_v_version_gallery\` (\`image_id\`);`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`_portfolio_v_version_gallery\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_gallery\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`_catalog_v_version_layouts\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`catalog_layouts\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`_catalog_v_version_advantages\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`catalog_advantages\`;`);
}
