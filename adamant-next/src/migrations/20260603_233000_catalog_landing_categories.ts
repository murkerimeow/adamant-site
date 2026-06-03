import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

async function tableExists(db: Db, table: string) {
  const rows = (await db.all(
    sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'`),
  )) as Array<{ name?: string }>;

  return rows.length > 0;
}

async function columnExists(db: Db, table: string, column: string) {
  if (!(await tableExists(db, table))) {
    return false;
  }

  const columns = (await db.all(sql.raw(`PRAGMA table_info(${table})`))) as Array<{
    name?: string;
  }>;

  return columns.some((item) => item.name === column);
}

async function addColumn(db: Db, table: string, column: string, definition: string) {
  if ((await tableExists(db, table)) && !(await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`));
  }
}

async function dropColumn(db: Db, table: string, column: string) {
  if ((await tableExists(db, table)) && (await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} DROP COLUMN ${column}`));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`catalog_categories\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`description\` text,
    \`show_in_header\` integer DEFAULT true,
    \`order\` numeric DEFAULT 0 NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`);
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`catalog_categories_slug_idx\` ON \`catalog_categories\` (\`slug\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_categories_updated_at_idx\` ON \`catalog_categories\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_categories_created_at_idx\` ON \`catalog_categories\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_categories_order_idx\` ON \`catalog_categories\` (\`order\`);`);

  await addColumn(db, "catalog", "landing_category_id", "integer REFERENCES catalog_categories(id)");
  await addColumn(
    db,
    "_catalog_v",
    "version_landing_category_id",
    "integer REFERENCES catalog_categories(id)",
  );
  await addColumn(
    db,
    "payload_locked_documents_rels",
    "catalog_categories_id",
    "integer REFERENCES catalog_categories(id)",
  );
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`catalog_landing_category_idx\` ON \`catalog\` (\`landing_category_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_catalog_v_version_landing_category_idx\` ON \`_catalog_v\` (\`version_landing_category_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_catalog_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`catalog_categories_id\`);`);

  await db.run(sql`INSERT OR IGNORE INTO \`catalog_categories\`
    (\`title\`, \`slug\`, \`description\`, \`show_in_header\`, \`order\`, \`updated_at\`, \`created_at\`)
    VALUES
      ('Дом из газобетона', 'dom-iz-gazobetona', 'Проекты домов из газобетона', true, 10, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      ('Каркасные дома', 'karkasnye-doma', 'Каркасные проекты загородных домов', true, 20, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      ('Дачные дома', 'dachnye-doma', 'Дачные дома для сезонного проживания', true, 30, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`_catalog_v_version_landing_category_idx\`;`);
  await db.run(sql`DROP INDEX IF EXISTS \`catalog_landing_category_idx\`;`);
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_catalog_categories_id_idx\`;`);
  await dropColumn(db, "payload_locked_documents_rels", "catalog_categories_id");
  await dropColumn(db, "_catalog_v", "version_landing_category_id");
  await dropColumn(db, "catalog", "landing_category_id");
  await db.run(sql`DROP TABLE IF EXISTS \`catalog_categories\`;`);
}
