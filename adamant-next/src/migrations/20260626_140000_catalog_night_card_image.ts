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

async function createIndex(db: Db, table: string, statement: string) {
  if (await tableExists(db, table)) {
    await db.run(sql.raw(statement));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addColumn(db, "catalog", "night_image_id", "integer REFERENCES media(id)");
  await addColumn(
    db,
    "_catalog_v",
    "version_night_image_id",
    "integer REFERENCES media(id)",
  );

  await createIndex(
    db,
    "catalog",
    "CREATE INDEX IF NOT EXISTS `catalog_night_image_idx` ON `catalog` (`night_image_id`)",
  );
  await createIndex(
    db,
    "_catalog_v",
    "CREATE INDEX IF NOT EXISTS `_catalog_v_version_night_image_idx` ON `_catalog_v` (`version_night_image_id`)",
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw("DROP INDEX IF EXISTS `_catalog_v_version_night_image_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `catalog_night_image_idx`"));
  await dropColumn(db, "_catalog_v", "version_night_image_id");
  await dropColumn(db, "catalog", "night_image_id");
}
