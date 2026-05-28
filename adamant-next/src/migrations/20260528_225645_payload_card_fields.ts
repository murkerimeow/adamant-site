import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

async function columnExists(db: MigrateUpArgs["db"], table: string, column: string) {
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
  if (!(await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`));
  }
}

async function dropColumn(db: MigrateUpArgs["db"], table: string, column: string) {
  if (await columnExists(db, table, column)) {
    await db.run(sql.raw(`ALTER TABLE ${table} DROP COLUMN ${column}`));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addColumn(db, "services", "show_on_services_page", "integer DEFAULT true");
  await addColumn(db, "services", "icon", "text DEFAULT 'home'");
  await addColumn(db, "services", "href", "text DEFAULT '/contacts'");
  await addColumn(db, "_services_v", "version_show_on_services_page", "integer DEFAULT true");
  await addColumn(db, "_services_v", "version_icon", "text DEFAULT 'home'");
  await addColumn(db, "_services_v", "version_href", "text DEFAULT '/contacts'");

  await addColumn(db, "portfolio", "catalog_item_id", "integer");
  await addColumn(db, "_portfolio_v", "version_catalog_item_id", "integer");
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_catalog_item_idx\` ON \`portfolio\` (\`catalog_item_id\`);`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_version_catalog_item_idx\` ON \`_portfolio_v\` (\`version_catalog_item_id\`);`,
  );

  await addColumn(db, "catalog", "is_hit", "integer DEFAULT false");
  await addColumn(db, "_catalog_v", "version_is_hit", "integer DEFAULT false");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`portfolio_catalog_item_idx\`;`);
  await db.run(sql`DROP INDEX IF EXISTS \`_portfolio_v_version_version_catalog_item_idx\`;`);

  await dropColumn(db, "_catalog_v", "version_is_hit");
  await dropColumn(db, "catalog", "is_hit");
  await dropColumn(db, "_portfolio_v", "version_catalog_item_id");
  await dropColumn(db, "portfolio", "catalog_item_id");
  await dropColumn(db, "_services_v", "version_href");
  await dropColumn(db, "_services_v", "version_icon");
  await dropColumn(db, "_services_v", "version_show_on_services_page");
  await dropColumn(db, "services", "href");
  await dropColumn(db, "services", "icon");
  await dropColumn(db, "services", "show_on_services_page");
}
