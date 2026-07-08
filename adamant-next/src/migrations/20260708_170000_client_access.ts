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
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`client_access\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`login\` text,
      \`access_enabled\` integer DEFAULT true,
      \`access_generated_at\` text,
      \`last_login_at\` text,
      \`password_hash\` text,
      \`notes\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`client_access_login_idx\` ON \`client_access\` (\`login\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`client_access_updated_at_idx\` ON \`client_access\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`client_access_created_at_idx\` ON \`client_access\` (\`created_at\`);`,
  );

  await addColumn(
    db,
    "payload_locked_documents_rels",
    "client_access_id",
    "integer REFERENCES client_access(id) ON DELETE cascade",
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_client_access_id_idx\` ON \`payload_locked_documents_rels\` (\`client_access_id\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_client_access_id_idx\`;`);
  await dropColumn(db, "payload_locked_documents_rels", "client_access_id");
  await db.run(sql`DROP TABLE IF EXISTS \`client_access\`;`);
}
