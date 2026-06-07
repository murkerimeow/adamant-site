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
  await addColumn(db, "posts", "seo_title", "text");
  await addColumn(db, "posts", "seo_description", "text");
  await addColumn(db, "_posts_v", "version_seo_title", "text");
  await addColumn(db, "_posts_v", "version_seo_description", "text");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await dropColumn(db, "_posts_v", "version_seo_description");
  await dropColumn(db, "_posts_v", "version_seo_title");
  await dropColumn(db, "posts", "seo_description");
  await dropColumn(db, "posts", "seo_title");
}
