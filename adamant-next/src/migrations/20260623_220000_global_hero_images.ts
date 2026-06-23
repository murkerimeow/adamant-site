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
  await addColumn(db, "home_page", "hero_image_id", "integer REFERENCES media(id)");
  await addColumn(db, "_home_page_v", "version_hero_image_id", "integer REFERENCES media(id)");
  await createIndex(
    db,
    "home_page",
    "CREATE INDEX IF NOT EXISTS `home_page_hero_image_idx` ON `home_page` (`hero_image_id`)",
  );
  await createIndex(
    db,
    "_home_page_v",
    "CREATE INDEX IF NOT EXISTS `_home_page_v_version_hero_image_idx` ON `_home_page_v` (`version_hero_image_id`)",
  );

  await addColumn(db, "about_page", "hero_image_id", "integer REFERENCES media(id)");
  await addColumn(db, "_about_page_v", "version_hero_image_id", "integer REFERENCES media(id)");
  await createIndex(
    db,
    "about_page",
    "CREATE INDEX IF NOT EXISTS `about_page_hero_image_idx` ON `about_page` (`hero_image_id`)",
  );
  await createIndex(
    db,
    "_about_page_v",
    "CREATE INDEX IF NOT EXISTS `_about_page_v_version_hero_image_idx` ON `_about_page_v` (`version_hero_image_id`)",
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw("DROP INDEX IF EXISTS `_about_page_v_version_hero_image_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `about_page_hero_image_idx`"));
  await dropColumn(db, "_about_page_v", "version_hero_image_id");
  await dropColumn(db, "about_page", "hero_image_id");

  await db.run(sql.raw("DROP INDEX IF EXISTS `_home_page_v_version_hero_image_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `home_page_hero_image_idx`"));
  await dropColumn(db, "_home_page_v", "version_hero_image_id");
  await dropColumn(db, "home_page", "hero_image_id");
}
