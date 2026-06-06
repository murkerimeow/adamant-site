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
  await addColumn(db, "portfolio", "seo_title", "text");
  await addColumn(db, "portfolio", "seo_description", "text");
  await addColumn(db, "_portfolio_v", "version_seo_title", "text");
  await addColumn(db, "_portfolio_v", "version_seo_description", "text");

  await addColumn(db, "site_settings_company_stats", "_uuid", "text");
  await addColumn(db, "_site_settings_v_version_company_stats", "_uuid", "text");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await dropColumn(db, "_site_settings_v_version_company_stats", "_uuid");
  await dropColumn(db, "site_settings_company_stats", "_uuid");

  await dropColumn(db, "_portfolio_v", "version_seo_description");
  await dropColumn(db, "_portfolio_v", "version_seo_title");
  await dropColumn(db, "portfolio", "seo_description");
  await dropColumn(db, "portfolio", "seo_title");
}
