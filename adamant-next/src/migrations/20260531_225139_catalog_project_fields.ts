import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

async function tableExists(db: MigrateUpArgs["db"], table: string) {
  const rows = (await db.all(
    sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'`),
  )) as Array<{ name?: string }>;

  return rows.length > 0;
}

async function columnExists(db: MigrateUpArgs["db"], table: string, column: string) {
  if (!(await tableExists(db, table))) {
    return false;
  }

  const columns = (await db.all(sql.raw(`PRAGMA table_info(${table})`))) as Array<{
    name?: string;
  }>;

  return columns.some((item) => item.name === column);
}

async function addColumn(
  db: MigrateUpArgs["db"],
  table: string,
  column: string,
  definition: string,
) {
  if ((await tableExists(db, table)) && !(await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`catalog_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_gallery_order_idx\` ON \`catalog_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_gallery_parent_id_idx\` ON \`catalog_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_gallery_image_idx\` ON \`catalog_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_catalog_v_version_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_gallery_order_idx\` ON \`_catalog_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_gallery_parent_id_idx\` ON \`_catalog_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_gallery_image_idx\` ON \`_catalog_v_version_gallery\` (\`image_id\`);`)
  await addColumn(db, "catalog", "price", "numeric");
  await addColumn(db, "catalog", "area", "numeric");
  await addColumn(db, "catalog", "floors", "numeric");
  await addColumn(db, "catalog", "rooms", "numeric");
  await addColumn(db, "_catalog_v", "version_price", "numeric");
  await addColumn(db, "_catalog_v", "version_area", "numeric");
  await addColumn(db, "_catalog_v", "version_floors", "numeric");
  await addColumn(db, "_catalog_v", "version_rooms", "numeric");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`catalog_gallery\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_catalog_v_version_gallery\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`price\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`area\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`floors\`;`)
  await db.run(sql`ALTER TABLE \`catalog\` DROP COLUMN \`rooms\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_price\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_area\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_floors\`;`)
  await db.run(sql`ALTER TABLE \`_catalog_v\` DROP COLUMN \`version_rooms\`;`)
}
