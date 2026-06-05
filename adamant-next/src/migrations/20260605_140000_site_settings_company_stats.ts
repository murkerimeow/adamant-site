import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

async function tableExists(db: Db, table: string) {
  const rows = (await db.all(
    sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'`),
  )) as Array<{ name?: string }>;

  return rows.length > 0;
}

async function createIndex(db: Db, table: string, statement: string) {
  if (await tableExists(db, table)) {
    await db.run(sql.raw(statement));
  }
}

async function seedCompanyStat(
  db: Db,
  order: number,
  id: string,
  statKey: string,
  value: string,
  label: string,
  showOnHome: boolean,
  showOnAbout: boolean,
) {
  if (!(await tableExists(db, "site_settings"))) {
    return;
  }

  await db.run(
    sql.raw(`
      INSERT INTO site_settings_company_stats
        (_order, _parent_id, id, stat_key, value, label, show_on_home, show_on_about)
      SELECT
        ${order},
        site_settings.id,
        '${id}',
        '${statKey}',
        '${value}',
        '${label}',
        ${showOnHome ? 1 : 0},
        ${showOnAbout ? 1 : 0}
      FROM site_settings
      WHERE NOT EXISTS (
        SELECT 1
        FROM site_settings_company_stats existing
        WHERE existing.id = '${id}'
      )
    `),
  );
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
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
      FOREIGN KEY (_parent_id) REFERENCES site_settings(id) ON DELETE cascade ON UPDATE no action
    )
  `));

  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS _site_settings_v_version_company_stats (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id text PRIMARY KEY NOT NULL,
      stat_key text DEFAULT 'custom',
      value text,
      label text,
      show_on_home integer DEFAULT true,
      show_on_about integer DEFAULT true,
      _uuid text,
      FOREIGN KEY (_parent_id) REFERENCES _site_settings_v(id) ON DELETE cascade ON UPDATE no action
    )
  `));

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
  await createIndex(
    db,
    "_site_settings_v_version_company_stats",
    "CREATE INDEX IF NOT EXISTS `_site_settings_v_version_company_stats_order_idx` ON `_site_settings_v_version_company_stats` (`_order`)",
  );
  await createIndex(
    db,
    "_site_settings_v_version_company_stats",
    "CREATE INDEX IF NOT EXISTS `_site_settings_v_version_company_stats_parent_id_idx` ON `_site_settings_v_version_company_stats` (`_parent_id`)",
  );

  await seedCompanyStat(db, 0, "built-homes", "builtHomes", "500+", "построенных домов", true, true);
  await seedCompanyStat(db, 1, "estimate-day", "estimateDay", "1 день", "на расчет сметы", true, false);
  await seedCompanyStat(db, 2, "happy-families", "happyFamilies", "450+", "довольных семей", true, true);
  await seedCompanyStat(db, 3, "market-years", "marketYears", "12+ лет", "на рынке", true, true);
  await seedCompanyStat(db, 4, "warranty", "warranty", "5 лет", "гарантии на работы", false, true);
  await seedCompanyStat(db, 5, "region", "region", "Работаем", "по всему СЗФО", false, true);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw("DROP INDEX IF EXISTS `_site_settings_v_version_company_stats_parent_id_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `_site_settings_v_version_company_stats_order_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `site_settings_company_stats_parent_id_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `site_settings_company_stats_order_idx`"));
  await db.run(sql.raw("DROP TABLE IF EXISTS _site_settings_v_version_company_stats"));
  await db.run(sql.raw("DROP TABLE IF EXISTS site_settings_company_stats"));
}
