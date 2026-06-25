import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

const defaultStats = [
  {
    id: "built-homes",
    label: "построенных домов",
    order: 0,
    showOnAbout: true,
    showOnHome: true,
    statKey: "builtHomes",
    value: "500+",
  },
  {
    id: "estimate-day",
    label: "на расчет сметы",
    order: 1,
    showOnAbout: false,
    showOnHome: true,
    statKey: "estimateDay",
    value: "1 день",
  },
  {
    id: "happy-families",
    label: "довольных семей",
    order: 2,
    showOnAbout: true,
    showOnHome: true,
    statKey: "happyFamilies",
    value: "450+",
  },
  {
    id: "market-years",
    label: "на рынке",
    order: 3,
    showOnAbout: true,
    showOnHome: true,
    statKey: "marketYears",
    value: "12+ лет",
  },
  {
    id: "warranty",
    label: "гарантии на работы",
    order: 4,
    showOnAbout: true,
    showOnHome: false,
    statKey: "warranty",
    value: "5 лет",
  },
  {
    id: "region",
    label: "по всему СЗФО",
    order: 5,
    showOnAbout: true,
    showOnHome: false,
    statKey: "region",
    value: "Работаем",
  },
] as const;

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

async function createIndex(db: Db, table: string, statement: string) {
  if (await tableExists(db, table)) {
    await db.run(sql.raw(statement));
  }
}

async function ensureCompanyStatsTable(db: Db) {
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS site_settings_company_stats (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id text PRIMARY KEY NOT NULL,
      stat_key text DEFAULT 'custom',
      value text,
      label text,
      show_on_home integer DEFAULT true,
      show_on_about integer DEFAULT true,
      _uuid text,
      FOREIGN KEY (_parent_id) REFERENCES site_settings(id) ON DELETE cascade ON UPDATE no action
    )
  `));

  await addColumn(db, "site_settings_company_stats", "_uuid", "text");
  await createIndex(
    db,
    "site_settings_company_stats",
    "CREATE INDEX IF NOT EXISTS `site_settings_company_stats_order_idx` ON `site_settings_company_stats` (`_order`)",
  );
  await createIndex(
    db,
    "site_settings_company_stats",
    "CREATE INDEX IF NOT EXISTS `site_settings_company_stats_parent_id_idx` ON `site_settings_company_stats` (`_parent_id`)",
  );
}

async function ensureSiteSettingsRow(db: Db) {
  if (!(await tableExists(db, "site_settings"))) {
    return null;
  }

  const rows = (await db.all(
    sql.raw("SELECT id FROM site_settings ORDER BY id LIMIT 1"),
  )) as Array<{ id?: number }>;

  if (rows[0]?.id) {
    return rows[0].id;
  }

  await db.run(sql.raw(`
    INSERT INTO site_settings (
      company_name,
      phone_primary,
      phone_secondary,
      working_hours,
      _status,
      updated_at,
      created_at
    )
    VALUES (
      'АДАМАНТ СТРОЙ',
      '+7 (911) 197-04-57',
      '+7 981 810-62-82',
      'ПН-ПТ, 10:00-16:00',
      'published',
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `));

  const createdRows = (await db.all(
    sql.raw("SELECT id FROM site_settings ORDER BY id LIMIT 1"),
  )) as Array<{ id?: number }>;

  return createdRows[0]?.id ?? null;
}

async function seedCompanyStats(db: Db, parentId: number) {
  for (const stat of defaultStats) {
    await db.run(sql.raw(`
      INSERT INTO site_settings_company_stats
        (_order, _parent_id, id, stat_key, value, label, show_on_home, show_on_about)
      SELECT
        ${stat.order},
        ${parentId},
        '${stat.id}',
        '${stat.statKey}',
        '${stat.value}',
        '${stat.label}',
        ${stat.showOnHome ? 1 : 0},
        ${stat.showOnAbout ? 1 : 0}
      WHERE NOT EXISTS (
        SELECT 1
        FROM site_settings_company_stats existing
        WHERE existing.id = '${stat.id}'
      )
    `));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const parentId = await ensureSiteSettingsRow(db);

  if (!parentId) {
    return;
  }

  await ensureCompanyStatsTable(db);
  await seedCompanyStats(db, parentId);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  if (!(await tableExists(db, "site_settings_company_stats"))) {
    return;
  }

  await db.run(sql.raw(`
    DELETE FROM site_settings_company_stats
    WHERE id IN (${defaultStats.map((stat) => `'${stat.id}'`).join(", ")})
  `));
}
