import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

type HeaderNavSeed = {
  badge?: string;
  href: string;
  id: string;
  label: string;
  navKey: string;
  order: number;
  showInHeader: boolean;
};

const defaultHeaderNavItems: HeaderNavSeed[] = [
  { href: "/", id: "home", label: "Главная", navKey: "home", order: 0, showInHeader: true },
  { href: "/services", id: "services", label: "Услуги", navKey: "services", order: 1, showInHeader: true },
  {
    badge: "NEW",
    href: "/mortgage",
    id: "mortgage",
    label: "Ипотека",
    navKey: "mortgage",
    order: 2,
    showInHeader: true,
  },
  { href: "/portfolio", id: "portfolio", label: "Портфолио", navKey: "portfolio", order: 3, showInHeader: true },
  { href: "/catalog", id: "catalog", label: "Проекты", navKey: "catalog", order: 4, showInHeader: true },
  { href: "/blog", id: "blog", label: "Блог", navKey: "blog", order: 5, showInHeader: true },
  { href: "/#reviews", id: "reviews", label: "Отзывы", navKey: "reviews", order: 6, showInHeader: true },
  { href: "/vacancies", id: "vacancies", label: "Вакансии", navKey: "vacancies", order: 7, showInHeader: true },
  { href: "/contacts", id: "contacts", label: "Контакты", navKey: "contacts", order: 8, showInHeader: true },
  { href: "/about", id: "about", label: "О нас", navKey: "about", order: 9, showInHeader: true },
];

function quoteSql(value: string) {
  return value.replaceAll("'", "''");
}

async function tableExists(db: Db, table: string) {
  const rows = (await db.all(
    sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${quoteSql(table)}'`),
  )) as Array<{ name?: string }>;

  return rows.length > 0;
}

async function createIndex(db: Db, table: string, statement: string) {
  if (await tableExists(db, table)) {
    await db.run(sql.raw(statement));
  }
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

async function ensureHeaderNavTables(db: Db) {
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS site_settings_header_nav_items (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id text PRIMARY KEY NOT NULL,
      nav_key text DEFAULT 'home',
      label text,
      href text,
      badge text,
      show_in_header integer DEFAULT true,
      _uuid text,
      FOREIGN KEY (_parent_id) REFERENCES site_settings(id) ON DELETE cascade ON UPDATE no action
    )
  `));

  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS _site_settings_v_version_header_nav_items (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id text PRIMARY KEY NOT NULL,
      nav_key text DEFAULT 'home',
      label text,
      href text,
      badge text,
      show_in_header integer DEFAULT true,
      _uuid text,
      FOREIGN KEY (_parent_id) REFERENCES _site_settings_v(id) ON DELETE cascade ON UPDATE no action
    )
  `));

  await createIndex(
    db,
    "site_settings_header_nav_items",
    "CREATE INDEX IF NOT EXISTS `site_settings_header_nav_items_order_idx` ON `site_settings_header_nav_items` (`_order`)",
  );
  await createIndex(
    db,
    "site_settings_header_nav_items",
    "CREATE INDEX IF NOT EXISTS `site_settings_header_nav_items_parent_id_idx` ON `site_settings_header_nav_items` (`_parent_id`)",
  );
  await createIndex(
    db,
    "_site_settings_v_version_header_nav_items",
    "CREATE INDEX IF NOT EXISTS `_site_settings_v_version_header_nav_items_order_idx` ON `_site_settings_v_version_header_nav_items` (`_order`)",
  );
  await createIndex(
    db,
    "_site_settings_v_version_header_nav_items",
    "CREATE INDEX IF NOT EXISTS `_site_settings_v_version_header_nav_items_parent_id_idx` ON `_site_settings_v_version_header_nav_items` (`_parent_id`)",
  );
}

async function seedHeaderNavItems(db: Db, parentId: number) {
  for (const item of defaultHeaderNavItems) {
    await db.run(sql.raw(`
      INSERT INTO site_settings_header_nav_items
        (_order, _parent_id, id, nav_key, label, href, badge, show_in_header, _uuid)
      SELECT
        ${item.order},
        ${parentId},
        '${quoteSql(item.id)}',
        '${quoteSql(item.navKey)}',
        '${quoteSql(item.label)}',
        '${quoteSql(item.href)}',
        ${item.badge ? `'${quoteSql(item.badge)}'` : "NULL"},
        ${item.showInHeader ? 1 : 0},
        '${quoteSql(item.id)}'
      WHERE NOT EXISTS (
        SELECT 1
        FROM site_settings_header_nav_items existing
        WHERE existing.id = '${quoteSql(item.id)}'
      )
    `));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const parentId = await ensureSiteSettingsRow(db);

  if (!parentId) {
    return;
  }

  await ensureHeaderNavTables(db);
  await seedHeaderNavItems(db, parentId);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw("DROP INDEX IF EXISTS `_site_settings_v_version_header_nav_items_parent_id_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `_site_settings_v_version_header_nav_items_order_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `site_settings_header_nav_items_parent_id_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `site_settings_header_nav_items_order_idx`"));
  await db.run(sql.raw("DROP TABLE IF EXISTS _site_settings_v_version_header_nav_items"));
  await db.run(sql.raw("DROP TABLE IF EXISTS site_settings_header_nav_items"));
}
