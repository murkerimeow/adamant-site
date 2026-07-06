import { type MigrateUpArgs } from "@payloadcms/db-sqlite";

type CatalogDoc = {
  id: number | string;
};

async function findCatalogDocs({
  draft,
  payload,
  req,
}: {
  draft: boolean;
  payload: MigrateUpArgs["payload"];
  req: MigrateUpArgs["req"];
}) {
  const result = await payload.find({
    collection: "catalog",
    depth: 0,
    draft,
    limit: 1000,
    overrideAccess: true,
    req,
    sort: "order",
  });

  return result.docs as CatalogDoc[];
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const [publishedDocs, draftDocs] = await Promise.all([
    findCatalogDocs({ draft: false, payload, req }),
    findCatalogDocs({ draft: true, payload, req }),
  ]);

  const draftIds = new Set(draftDocs.map((doc) => String(doc.id)));
  const missingVersionDocs = publishedDocs.filter((doc) => !draftIds.has(String(doc.id)));

  for (const doc of missingVersionDocs) {
    await payload.update({
      collection: "catalog",
      id: doc.id,
      data: {
        _status: "published",
      },
      draft: false,
      overrideAccess: true,
      req,
    });
  }

  if (missingVersionDocs.length > 0) {
    payload.logger.info(
      `Restored catalog draft versions for ${missingVersionDocs.length} published docs.`,
    );
  }
}

export async function down(): Promise<void> {}
