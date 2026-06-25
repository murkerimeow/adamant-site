import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

type Db = MigrateUpArgs["db"];

const portfolioCategories = [
  {
    description:
      "Готовые частные дома и коттеджи, построенные компанией АДАМАНТ Строй в Санкт-Петербурге и Ленинградской области.",
    h1: "Построенные дома компании «АДАМАНТ Строй»",
    order: 10,
    slug: "built-houses",
    title: "Построенные дома",
  },
  {
    description:
      "Коммерческие объекты, офисные и общественные пространства, реализованные нашей командой.",
    h1: "Построенные коммерческие объекты",
    order: 20,
    slug: "commercial-buildings",
    title: "Построенные коммерческие объекты",
  },
  {
    description:
      "Примеры ремонта квартир с продуманной планировкой, отделкой и контролем качества.",
    h1: "Ремонт квартир",
    order: 30,
    slug: "apartment-renovation",
    title: "Ремонт квартир",
  },
  {
    description:
      "Отделка коммерческих помещений, офисов, салонов и общественных пространств.",
    h1: "Отделка коммерческих помещений",
    order: 40,
    slug: "commercial-finishing",
    title: "Отделка коммерческих помещений",
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

async function dropColumn(db: Db, table: string, column: string) {
  if ((await tableExists(db, table)) && (await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} DROP COLUMN ${column}`));
  }
}

async function createIndex(db: Db, table: string, statement: string) {
  if (await tableExists(db, table)) {
    await db.run(sql.raw(statement));
  }
}

async function ensurePortfolioCategoryTable(db: Db) {
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS portfolio_categories (
      id integer PRIMARY KEY NOT NULL,
      title text NOT NULL,
      slug text NOT NULL,
      description text,
      h1 text,
      seo_title text,
      seo_description text,
      hero_image_id integer REFERENCES media(id),
      show_in_navigation integer DEFAULT true,
      "order" numeric DEFAULT 0 NOT NULL,
      updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    )
  `));

  await createIndex(
    db,
    "portfolio_categories",
    "CREATE UNIQUE INDEX IF NOT EXISTS `portfolio_categories_slug_idx` ON `portfolio_categories` (`slug`)",
  );
  await createIndex(
    db,
    "portfolio_categories",
    "CREATE INDEX IF NOT EXISTS `portfolio_categories_updated_at_idx` ON `portfolio_categories` (`updated_at`)",
  );
  await createIndex(
    db,
    "portfolio_categories",
    "CREATE INDEX IF NOT EXISTS `portfolio_categories_created_at_idx` ON `portfolio_categories` (`created_at`)",
  );
  await createIndex(
    db,
    "portfolio_categories",
    "CREATE INDEX IF NOT EXISTS `portfolio_categories_order_idx` ON `portfolio_categories` (`order`)",
  );
  await createIndex(
    db,
    "portfolio_categories",
    "CREATE INDEX IF NOT EXISTS `portfolio_categories_hero_image_idx` ON `portfolio_categories` (`hero_image_id`)",
  );
}

async function seedPortfolioCategories(db: Db) {
  for (const category of portfolioCategories) {
    await db.run(sql.raw(`
      INSERT INTO portfolio_categories (
        title,
        slug,
        description,
        h1,
        show_in_navigation,
        "order",
        updated_at,
        created_at
      )
      VALUES (
        '${category.title}',
        '${category.slug}',
        '${category.description}',
        '${category.h1}',
        true,
        ${category.order},
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = COALESCE(portfolio_categories.description, excluded.description),
        h1 = COALESCE(portfolio_categories.h1, excluded.h1),
        show_in_navigation = COALESCE(portfolio_categories.show_in_navigation, excluded.show_in_navigation),
        "order" = excluded."order",
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    `));
  }
}

async function assignPortfolioCategories(db: Db) {
  if (!(await tableExists(db, "portfolio")) || !(await columnExists(db, "portfolio", "category_id"))) {
    return;
  }

  await db.run(sql.raw(`
    UPDATE portfolio
    SET category_id = (
      SELECT id
      FROM portfolio_categories
      WHERE slug = CASE
        WHEN title LIKE '%ремонт%' OR title LIKE '%Ремонт%'
          OR summary LIKE '%ремонт%' OR summary LIKE '%Ремонт%'
          OR description LIKE '%ремонт%' OR description LIKE '%Ремонт%'
          THEN 'apartment-renovation'
        WHEN title LIKE '%отделк%' OR title LIKE '%Отделк%'
          OR summary LIKE '%отделк%' OR summary LIKE '%Отделк%'
          OR description LIKE '%отделк%' OR description LIKE '%Отделк%'
          OR title LIKE '%музей%' OR title LIKE '%Музей%'
          OR summary LIKE '%музей%' OR summary LIKE '%Музей%'
          OR description LIKE '%музей%' OR description LIKE '%Музей%'
          OR title LIKE '%офис%' OR title LIKE '%Офис%'
          OR summary LIKE '%офис%' OR summary LIKE '%Офис%'
          OR description LIKE '%офис%' OR description LIKE '%Офис%'
          THEN 'commercial-finishing'
        WHEN title LIKE '%коммерческ%' OR title LIKE '%Коммерческ%'
          OR summary LIKE '%коммерческ%' OR summary LIKE '%Коммерческ%'
          OR description LIKE '%коммерческ%' OR description LIKE '%Коммерческ%'
          OR title LIKE '%склад%' OR title LIKE '%Склад%'
          OR summary LIKE '%склад%' OR summary LIKE '%Склад%'
          OR description LIKE '%склад%' OR description LIKE '%Склад%'
          THEN 'commercial-buildings'
        ELSE 'built-houses'
      END
    )
    WHERE category_id IS NULL
  `));
}

async function assignPortfolioVersionCategories(db: Db) {
  if (
    !(await tableExists(db, "_portfolio_v")) ||
    !(await columnExists(db, "_portfolio_v", "version_category_id"))
  ) {
    return;
  }

  await db.run(sql.raw(`
    UPDATE _portfolio_v
    SET version_category_id = (
      SELECT id
      FROM portfolio_categories
      WHERE slug = CASE
        WHEN version_title LIKE '%ремонт%' OR version_title LIKE '%Ремонт%'
          OR version_summary LIKE '%ремонт%' OR version_summary LIKE '%Ремонт%'
          OR version_description LIKE '%ремонт%' OR version_description LIKE '%Ремонт%'
          THEN 'apartment-renovation'
        WHEN version_title LIKE '%отделк%' OR version_title LIKE '%Отделк%'
          OR version_summary LIKE '%отделк%' OR version_summary LIKE '%Отделк%'
          OR version_description LIKE '%отделк%' OR version_description LIKE '%Отделк%'
          OR version_title LIKE '%музей%' OR version_title LIKE '%Музей%'
          OR version_summary LIKE '%музей%' OR version_summary LIKE '%Музей%'
          OR version_description LIKE '%музей%' OR version_description LIKE '%Музей%'
          OR version_title LIKE '%офис%' OR version_title LIKE '%Офис%'
          OR version_summary LIKE '%офис%' OR version_summary LIKE '%Офис%'
          OR version_description LIKE '%офис%' OR version_description LIKE '%Офис%'
          THEN 'commercial-finishing'
        WHEN version_title LIKE '%коммерческ%' OR version_title LIKE '%Коммерческ%'
          OR version_summary LIKE '%коммерческ%' OR version_summary LIKE '%Коммерческ%'
          OR version_description LIKE '%коммерческ%' OR version_description LIKE '%Коммерческ%'
          OR version_title LIKE '%склад%' OR version_title LIKE '%Склад%'
          OR version_summary LIKE '%склад%' OR version_summary LIKE '%Склад%'
          OR version_description LIKE '%склад%' OR version_description LIKE '%Склад%'
          THEN 'commercial-buildings'
        ELSE 'built-houses'
      END
    )
    WHERE version_category_id IS NULL
  `));
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await ensurePortfolioCategoryTable(db);
  await seedPortfolioCategories(db);

  await addColumn(db, "portfolio", "category_id", "integer REFERENCES portfolio_categories(id)");
  await addColumn(
    db,
    "_portfolio_v",
    "version_category_id",
    "integer REFERENCES portfolio_categories(id)",
  );
  await addColumn(
    db,
    "payload_locked_documents_rels",
    "portfolio_categories_id",
    "integer REFERENCES portfolio_categories(id)",
  );

  await createIndex(
    db,
    "portfolio",
    "CREATE INDEX IF NOT EXISTS `portfolio_category_idx` ON `portfolio` (`category_id`)",
  );
  await createIndex(
    db,
    "_portfolio_v",
    "CREATE INDEX IF NOT EXISTS `_portfolio_v_version_category_idx` ON `_portfolio_v` (`version_category_id`)",
  );
  await createIndex(
    db,
    "payload_locked_documents_rels",
    "CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_portfolio_categories_id_idx` ON `payload_locked_documents_rels` (`portfolio_categories_id`)",
  );

  await assignPortfolioCategories(db);
  await assignPortfolioVersionCategories(db);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw("DROP INDEX IF EXISTS `payload_locked_documents_rels_portfolio_categories_id_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `_portfolio_v_version_category_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_category_idx`"));
  await dropColumn(db, "payload_locked_documents_rels", "portfolio_categories_id");
  await dropColumn(db, "_portfolio_v", "version_category_id");
  await dropColumn(db, "portfolio", "category_id");
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_categories_hero_image_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_categories_order_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_categories_created_at_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_categories_updated_at_idx`"));
  await db.run(sql.raw("DROP INDEX IF EXISTS `portfolio_categories_slug_idx`"));
  await db.run(sql.raw("DROP TABLE IF EXISTS portfolio_categories"));
}
