import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

async function tableExists(db: MigrateUpArgs["db"], table: string) {
  const rows = (await db.all(
    sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'`),
  )) as Array<{ name?: string }>;

  return rows.length > 0;
}

async function columnExists(db: MigrateUpArgs["db"], table: string, column: string) {
  if (!(await tableExists(db, table))) {
    return false;
  }

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
  if ((await tableExists(db, table)) && !(await columnExists(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`));
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`reviews\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`caption\` text,
    \`avatar_id\` integer,
    \`rating\` numeric DEFAULT 5 NOT NULL,
    \`text\` text NOT NULL,
    \`order\` numeric DEFAULT 0 NOT NULL,
    \`published\` integer DEFAULT true,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`reviews_avatar_idx\` ON \`reviews\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`team_members\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`role\` text NOT NULL,
    \`description\` text,
    \`avatar_id\` integer,
    \`order\` numeric DEFAULT 0 NOT NULL,
    \`published\` integer DEFAULT true,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`team_members_avatar_idx\` ON \`team_members\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`team_members_updated_at_idx\` ON \`team_members\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`team_members_created_at_idx\` ON \`team_members\` (\`created_at\`);`)
  await addColumn(db, "payload_locked_documents_rels", "reviews_id", "integer REFERENCES reviews(id)");
  await addColumn(
    db,
    "payload_locked_documents_rels",
    "team_members_id",
    "integer REFERENCES team_members(id)",
  );
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_team_members_id_idx\` ON \`payload_locked_documents_rels\` (\`team_members_id\`);`)
  await addColumn(db, "blog_page_instagram_videos", "video_url", "text");
  await addColumn(
    db,
    "blog_page_instagram_videos",
    "poster_image_id",
    "integer REFERENCES media(id)",
  );
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_page_instagram_videos_poster_image_idx\` ON \`blog_page_instagram_videos\` (\`poster_image_id\`);`)
  await addColumn(db, "_blog_page_v_version_instagram_videos", "video_url", "text");
  await addColumn(
    db,
    "_blog_page_v_version_instagram_videos",
    "poster_image_id",
    "integer REFERENCES media(id)",
  );
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_blog_page_v_version_instagram_videos_poster_image_idx\` ON \`_blog_page_v_version_instagram_videos\` (\`poster_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`team_members\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`media_id\` integer,
    \`posts_id\` integer,
    \`services_id\` integer,
    \`portfolio_id\` integer,
    \`catalog_id\` integer,
    \`vacancies_id\` integer,
    \`requests_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`portfolio_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`catalog_id\`) REFERENCES \`catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`vacancies_id\`) REFERENCES \`vacancies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`requests_id\`) REFERENCES \`requests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "services_id", "portfolio_id", "catalog_id", "vacancies_id", "requests_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "services_id", "portfolio_id", "catalog_id", "vacancies_id", "requests_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_portfolio_id_idx\` ON \`payload_locked_documents_rels\` (\`portfolio_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_catalog_id_idx\` ON \`payload_locked_documents_rels\` (\`catalog_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vacancies_id_idx\` ON \`payload_locked_documents_rels\` (\`vacancies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`requests_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_blog_page_instagram_videos\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`label\` text,
    \`title\` text,
    \`instagram_url\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blog_page_instagram_videos\`("_order", "_parent_id", "id", "label", "title", "instagram_url") SELECT "_order", "_parent_id", "id", "label", "title", "instagram_url" FROM \`blog_page_instagram_videos\`;`)
  await db.run(sql`DROP TABLE \`blog_page_instagram_videos\`;`)
  await db.run(sql`ALTER TABLE \`__new_blog_page_instagram_videos\` RENAME TO \`blog_page_instagram_videos\`;`)
  await db.run(sql`CREATE INDEX \`blog_page_instagram_videos_order_idx\` ON \`blog_page_instagram_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_page_instagram_videos_parent_id_idx\` ON \`blog_page_instagram_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__blog_page_v_version_instagram_videos\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`label\` text,
    \`title\` text,
    \`instagram_url\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_blog_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__blog_page_v_version_instagram_videos\`("_order", "_parent_id", "id", "label", "title", "instagram_url", "_uuid") SELECT "_order", "_parent_id", "id", "label", "title", "instagram_url", "_uuid" FROM \`_blog_page_v_version_instagram_videos\`;`)
  await db.run(sql`DROP TABLE \`_blog_page_v_version_instagram_videos\`;`)
  await db.run(sql`ALTER TABLE \`__new__blog_page_v_version_instagram_videos\` RENAME TO \`_blog_page_v_version_instagram_videos\`;`)
  await db.run(sql`CREATE INDEX \`_blog_page_v_version_instagram_videos_order_idx\` ON \`_blog_page_v_version_instagram_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_blog_page_v_version_instagram_videos_parent_id_idx\` ON \`_blog_page_v_version_instagram_videos\` (\`_parent_id\`);`)
}
