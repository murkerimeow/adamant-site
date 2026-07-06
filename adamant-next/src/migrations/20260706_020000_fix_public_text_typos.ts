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

function quoteSql(value: string) {
  return value.replaceAll("'", "''");
}

async function replaceText(db: Db, table: string, column: string, from: string, to: string) {
  if (!(await columnExists(db, table, column))) {
    return;
  }

  const updatedAt = (await columnExists(db, table, "updated_at"))
    ? `, "updated_at" = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
    : "";

  await db.run(sql.raw(`
    UPDATE "${table}"
    SET "${column}" = REPLACE("${column}", '${quoteSql(from)}', '${quoteSql(to)}')${updatedAt}
    WHERE "${column}" LIKE '%${quoteSql(from)}%'
  `));
}

async function replaceMany(db: Db, replacements: Array<[string, string]>) {
  const targets: Array<[string, string[]]> = [
    ["portfolio", ["title", "seo_title", "seo_description", "summary", "description"]],
    [
      "_portfolio_v",
      [
        "version_title",
        "version_seo_title",
        "version_seo_description",
        "version_summary",
        "version_description",
      ],
    ],
    ["media", ["alt", "caption"]],
    ["catalog", ["seo_title", "seo_description", "card_summary", "description"]],
    [
      "_catalog_v",
      [
        "version_seo_title",
        "version_seo_description",
        "version_card_summary",
        "version_description",
      ],
    ],
    ["catalog_advantages", ["text"]],
    ["_catalog_v_version_advantages", ["text"]],
  ];

  for (const [table, columns] of targets) {
    for (const column of columns) {
      for (const [from, to] of replacements) {
        await replaceText(db, table, column, from, to);
      }
    }
  }
}

const replacements: Array<[string, string]> = [
  ["Дизайн интерьра", "Дизайн интерьера"],
  ["дизайн интерьра", "дизайн интерьера"],
  [" м2", " м²"],
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await replaceMany(db, replacements);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await replaceMany(
    db,
    replacements.map(([from, to]) => [to, from]),
  );
}
