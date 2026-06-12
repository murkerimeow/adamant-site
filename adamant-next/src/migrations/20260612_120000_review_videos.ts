import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

async function columnExists(db: MigrateUpArgs["db"], table: string, column: string) {
  const columns = (await db.all(sql.raw(`PRAGMA table_info(${table})`))) as Array<{
    name?: string;
  }>;

  return columns.some((item) => item.name === column);
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  if (!(await columnExists(db, "reviews", "video_id"))) {
    await db.run(
      sql.raw(
        "ALTER TABLE reviews ADD COLUMN video_id integer REFERENCES media(id) ON UPDATE no action ON DELETE set null",
      ),
    );
  }

  if (!(await columnExists(db, "reviews", "poster_id"))) {
    await db.run(
      sql.raw(
        "ALTER TABLE reviews ADD COLUMN poster_id integer REFERENCES media(id) ON UPDATE no action ON DELETE set null",
      ),
    );
  }

  await db.run(sql`CREATE INDEX IF NOT EXISTS \`reviews_video_idx\` ON \`reviews\` (\`video_id\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`reviews_poster_idx\` ON \`reviews\` (\`poster_id\`);`);

  if (await columnExists(db, "home_page", "section_eyebrows_reviews")) {
    await db.run(
      sql.raw(
        "UPDATE home_page SET section_eyebrows_reviews = 'Отзывы' WHERE section_eyebrows_reviews IS NULL OR section_eyebrows_reviews = 'Отзывы клиентов'",
      ),
    );
  }

  if (await columnExists(db, "home_page", "section_headings_reviews")) {
    await db.run(
      sql.raw(
        "UPDATE home_page SET section_headings_reviews = 'Отзывы клиентов о строительстве домов и ремонте помещений' WHERE section_headings_reviews IS NULL OR section_headings_reviews = 'Нам доверяют'",
      ),
    );
  }

  if (await columnExists(db, "_home_page_v", "version_section_eyebrows_reviews")) {
    await db.run(
      sql.raw(
        "UPDATE _home_page_v SET version_section_eyebrows_reviews = 'Отзывы' WHERE version_section_eyebrows_reviews IS NULL OR version_section_eyebrows_reviews = 'Отзывы клиентов'",
      ),
    );
  }

  if (await columnExists(db, "_home_page_v", "version_section_headings_reviews")) {
    await db.run(
      sql.raw(
        "UPDATE _home_page_v SET version_section_headings_reviews = 'Отзывы клиентов о строительстве домов и ремонте помещений' WHERE version_section_headings_reviews IS NULL OR version_section_headings_reviews = 'Нам доверяют'",
      ),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`reviews_video_idx\`;`);
  await db.run(sql`DROP INDEX IF EXISTS \`reviews_poster_idx\`;`);
}
