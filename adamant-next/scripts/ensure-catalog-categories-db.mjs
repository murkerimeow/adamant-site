import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, "..");
const databaseUrl =
  process.env.DATABASE_URI ?? `file:${path.resolve(projectRoot, "adamant.db")}`;

const db = createClient({ url: databaseUrl });

async function execute(sql) {
  await db.execute(sql);
}

async function tableExists(table) {
  const result = await db.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    args: [table],
  });

  return result.rows.length > 0;
}

async function columnExists(table, column) {
  if (!(await tableExists(table))) {
    return false;
  }

  const result = await db.execute(`PRAGMA table_info(${table})`);
  return result.rows.some((row) => row.name === column);
}

async function addColumn(table, column, definition) {
  if ((await tableExists(table)) && !(await columnExists(table, column))) {
    await execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

await execute(`CREATE TABLE IF NOT EXISTS catalog_categories (
  id integer PRIMARY KEY NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  show_in_header integer DEFAULT true,
  "order" numeric DEFAULT 0 NOT NULL,
  updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
)`);

await execute(
  "CREATE UNIQUE INDEX IF NOT EXISTS catalog_categories_slug_idx ON catalog_categories (slug)",
);
await execute(
  "CREATE INDEX IF NOT EXISTS catalog_categories_updated_at_idx ON catalog_categories (updated_at)",
);
await execute(
  "CREATE INDEX IF NOT EXISTS catalog_categories_created_at_idx ON catalog_categories (created_at)",
);
await execute(
  'CREATE INDEX IF NOT EXISTS catalog_categories_order_idx ON catalog_categories ("order")',
);

await addColumn(
  "catalog",
  "landing_category_id",
  "integer REFERENCES catalog_categories(id)",
);
await addColumn(
  "_catalog_v",
  "version_landing_category_id",
  "integer REFERENCES catalog_categories(id)",
);
await addColumn(
  "payload_locked_documents_rels",
  "catalog_categories_id",
  "integer REFERENCES catalog_categories(id)",
);

await execute(
  "CREATE INDEX IF NOT EXISTS catalog_landing_category_idx ON catalog (landing_category_id)",
);
await execute(
  "CREATE INDEX IF NOT EXISTS _catalog_v_version_landing_category_idx ON _catalog_v (version_landing_category_id)",
);
await execute(
  "CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_catalog_categories_id_idx ON payload_locked_documents_rels (catalog_categories_id)",
);

for (const category of [
  {
    title: "Дом из газобетона",
    slug: "dom-iz-gazobetona",
    description: "Проекты домов из газобетона",
    order: 10,
  },
  {
    title: "Каркасные дома",
    slug: "karkasnye-doma",
    description: "Каркасные проекты загородных домов",
    order: 20,
  },
  {
    title: "Дачные дома",
    slug: "dachnye-doma",
    description: "Дачные дома для сезонного проживания",
    order: 30,
  },
]) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO catalog_categories
      (title, slug, description, show_in_header, "order", updated_at, created_at)
      VALUES (?, ?, ?, true, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    args: [category.title, category.slug, category.description, category.order],
  });
}

console.log("Catalog categories schema is ready.");
