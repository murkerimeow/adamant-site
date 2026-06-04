import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

async function columnExists(db: Db, table: string, column: string) {
  const columns = (await db.all(sql.raw(`PRAGMA table_info(${table})`))) as Array<{
    name?: string;
  }>;

  return columns.some((item) => item.name === column);
}

async function addColumn(db: Db, table: string, column: string, definition: string) {
  if (!(await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`));
  }
}

async function dropColumn(db: Db, table: string, column: string) {
  if (await columnExists(db, table, column)) {
    await db.run(sql.raw(`ALTER TABLE ${table} DROP COLUMN ${column}`));
  }
}

const fields = [
  "about",
  "projects",
  "trust",
  "process",
  "process_lead",
  "services",
  "portfolio",
  "reviews",
  "faq",
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const field of fields) {
    await addColumn(db, "home_page", `section_headings_${field}`, "text");
    await addColumn(db, "_home_page_v", `version_section_headings_${field}`, "text");
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const field of [...fields].reverse()) {
    await dropColumn(db, "_home_page_v", `version_section_headings_${field}`);
    await dropColumn(db, "home_page", `section_headings_${field}`);
  }
}
