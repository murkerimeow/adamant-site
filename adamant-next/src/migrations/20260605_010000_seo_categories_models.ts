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

const introGlobals = [
  "about_page",
  "blog_page",
  "catalog_page",
  "contacts_page",
  "portfolio_page",
  "services_page",
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addColumn(db, "catalog_categories", "h1", "text");
  await addColumn(db, "catalog_categories", "seo_title", "text");
  await addColumn(db, "catalog_categories", "seo_description", "text");
  await addColumn(db, "catalog_categories", "hero_image_id", "integer REFERENCES media(id)");
  await createIndex(
    db,
    "catalog_categories",
    "CREATE INDEX IF NOT EXISTS `catalog_categories_hero_image_idx` ON `catalog_categories` (`hero_image_id`)",
  );

  await addColumn(db, "catalog", "model3d_id", "integer REFERENCES media(id)");
  await addColumn(db, "_catalog_v", "version_model3d_id", "integer REFERENCES media(id)");
  await createIndex(
    db,
    "catalog",
    "CREATE INDEX IF NOT EXISTS `catalog_model3d_idx` ON `catalog` (`model3d_id`)",
  );
  await createIndex(
    db,
    "_catalog_v",
    "CREATE INDEX IF NOT EXISTS `_catalog_v_version_model3d_idx` ON `_catalog_v` (`version_model3d_id`)",
  );

  await addColumn(db, "home_page", "seo_title", "text");
  await addColumn(db, "home_page", "seo_description", "text");
  await addColumn(db, "_home_page_v", "version_seo_title", "text");
  await addColumn(db, "_home_page_v", "version_seo_description", "text");

  for (const table of introGlobals) {
    await addColumn(db, table, "seo_title", "text");
    await addColumn(db, table, "seo_description", "text");
    await addColumn(db, `_${table}_v`, "version_seo_title", "text");
    await addColumn(db, `_${table}_v`, "version_seo_description", "text");
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...introGlobals].reverse()) {
    await dropColumn(db, `_${table}_v`, "version_seo_description");
    await dropColumn(db, `_${table}_v`, "version_seo_title");
    await dropColumn(db, table, "seo_description");
    await dropColumn(db, table, "seo_title");
  }

  await dropColumn(db, "_home_page_v", "version_seo_description");
  await dropColumn(db, "_home_page_v", "version_seo_title");
  await dropColumn(db, "home_page", "seo_description");
  await dropColumn(db, "home_page", "seo_title");

  await db.run(sql.raw("DROP INDEX IF EXISTS `_catalog_v_version_model3d_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `catalog_model3d_idx`"));
  await dropColumn(db, "_catalog_v", "version_model3d_id");
  await dropColumn(db, "catalog", "model3d_id");

  await db.run(sql.raw("DROP INDEX IF EXISTS `catalog_categories_hero_image_idx`"));
  await dropColumn(db, "catalog_categories", "hero_image_id");
  await dropColumn(db, "catalog_categories", "seo_description");
  await dropColumn(db, "catalog_categories", "seo_title");
  await dropColumn(db, "catalog_categories", "h1");
}
