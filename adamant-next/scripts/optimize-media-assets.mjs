import fs from "fs/promises";
import path from "path";

import { createClient } from "@libsql/client";
import sharp from "sharp";

const databaseUrl = process.env.DATABASE_URI ?? "file:adamant.db";
const mediaDir = path.resolve(process.cwd(), "media");
const webpOptions = { effort: 6, quality: 82 };
const dryRun = process.argv.includes("--dry-run");
const webpRecompressMinBytes = Number(
  process.env.MEDIA_WEBP_RECOMPRESS_MIN_BYTES ?? 300000,
);

function isPngOrJpeg(filename, mimeType) {
  return (
    /^image\/(?:png|jpe?g)$/i.test(mimeType || "") ||
    /\.(?:png|jpe?g)$/i.test(filename || "")
  );
}

function isWebp(filename, mimeType) {
  return /^image\/webp$/i.test(mimeType || "") || /\.webp$/i.test(filename || "");
}

function isAlreadyOptimizedWebp(filename) {
  return /(?:^|-)optimized(?:-|$)/i.test(path.parse(filename || "").name);
}

function shouldOptimizeImage(filename, mimeType, filesize) {
  if (isPngOrJpeg(filename, mimeType)) {
    return true;
  }

  if (!isWebp(filename, mimeType) || isAlreadyOptimizedWebp(filename)) {
    return false;
  }

  return Number(filesize || 0) >= webpRecompressMinBytes;
}

function makeUrl(filename) {
  return `/api/media/file/${filename}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function makeUniqueOutputPath(baseName) {
  let candidate = path.join(mediaDir, baseName);
  let counter = 1;

  while (await fileExists(candidate)) {
    const parsed = path.parse(baseName);
    candidate = path.join(mediaDir, `${parsed.name}-${counter}${parsed.ext}`);
    counter += 1;
  }

  return candidate;
}

function outputBaseName(filename, id, label) {
  const parsed = path.parse(filename);
  const safeStem = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const stem = safeStem || "media";
  const suffix = label ? `-${label}` : "";

  return `${stem}-${id}${suffix}-optimized.webp`;
}

async function convertFile({ filename, id, label }) {
  if (!filename) return null;

  const sourcePath = path.join(mediaDir, filename);

  if (!(await fileExists(sourcePath))) {
    return null;
  }

  const source = await fs.readFile(sourcePath);
  const sourceMetadata = await sharp(source).metadata();
  const output = await sharp(source, { animated: false }).webp(webpOptions).toBuffer();
  const outputMetadata = await sharp(output).metadata();

  if (
    sourceMetadata.width !== outputMetadata.width ||
    sourceMetadata.height !== outputMetadata.height
  ) {
    throw new Error(
      `Dimension mismatch for ${filename}: ${sourceMetadata.width}x${sourceMetadata.height} -> ${outputMetadata.width}x${outputMetadata.height}`,
    );
  }

  if (output.length >= source.length) {
    return {
      changed: false,
      reason: "converted file is not smaller",
      saved: 0,
    };
  }

  const outputPath = await makeUniqueOutputPath(outputBaseName(filename, id, label));
  const outputName = path.basename(outputPath);

  if (!dryRun) {
    const tempPath = `${outputPath}.tmp`;
    await fs.writeFile(tempPath, output);
    await fs.rename(tempPath, outputPath);
  }

  return {
    changed: true,
    filename: outputName,
    filesize: output.length,
    height: outputMetadata.height,
    mimeType: "image/webp",
    originalFilesize: source.length,
    saved: source.length - output.length,
    url: makeUrl(outputName),
    width: outputMetadata.width,
  };
}

function nextField(current, converted, field) {
  return converted?.changed ? converted[field] : current;
}

async function main() {
  const db = createClient({ url: databaseUrl });
  const result = await db.execute(`
    SELECT
      id,
      filename,
      url,
      mime_type,
      filesize,
      width,
      height,
      sizes_card_filename,
      sizes_card_url,
      sizes_card_mime_type,
      sizes_card_filesize,
      sizes_card_width,
      sizes_card_height,
      sizes_thumb_filename,
      sizes_thumb_url,
      sizes_thumb_mime_type,
      sizes_thumb_filesize,
      sizes_thumb_width,
      sizes_thumb_height
    FROM media
  `);

  let updated = 0;
  let skipped = 0;
  let savedBytes = 0;

  for (const row of result.rows) {
    const original = shouldOptimizeImage(row.filename, row.mime_type, row.filesize)
      ? await convertFile({ filename: row.filename, id: row.id, label: "" })
      : null;
    const card = shouldOptimizeImage(
      row.sizes_card_filename,
      row.sizes_card_mime_type,
      row.sizes_card_filesize,
    )
      ? await convertFile({
          filename: row.sizes_card_filename,
          id: row.id,
          label: "card",
        })
      : null;
    const thumb = shouldOptimizeImage(
      row.sizes_thumb_filename,
      row.sizes_thumb_mime_type,
      row.sizes_thumb_filesize,
    )
      ? await convertFile({
          filename: row.sizes_thumb_filename,
          id: row.id,
          label: "thumb",
        })
      : null;

    const changed = [original, card, thumb].some((file) => file?.changed);

    if (!changed) {
      skipped += 1;
      continue;
    }

    savedBytes +=
      (original?.saved || 0) + (card?.saved || 0) + (thumb?.saved || 0);

    if (!dryRun) {
      await db.execute({
        args: {
          cardFilesize: nextField(row.sizes_card_filesize, card, "filesize"),
          cardFilename: nextField(row.sizes_card_filename, card, "filename"),
          cardHeight: nextField(row.sizes_card_height, card, "height"),
          cardMimeType: nextField(row.sizes_card_mime_type, card, "mimeType"),
          cardUrl: nextField(row.sizes_card_url, card, "url"),
          cardWidth: nextField(row.sizes_card_width, card, "width"),
          filename: nextField(row.filename, original, "filename"),
          filesize: nextField(row.filesize, original, "filesize"),
          height: nextField(row.height, original, "height"),
          id: row.id,
          mimeType: nextField(row.mime_type, original, "mimeType"),
          thumbFilesize: nextField(row.sizes_thumb_filesize, thumb, "filesize"),
          thumbFilename: nextField(row.sizes_thumb_filename, thumb, "filename"),
          thumbHeight: nextField(row.sizes_thumb_height, thumb, "height"),
          thumbMimeType: nextField(row.sizes_thumb_mime_type, thumb, "mimeType"),
          thumbUrl: nextField(row.sizes_thumb_url, thumb, "url"),
          thumbWidth: nextField(row.sizes_thumb_width, thumb, "width"),
          updatedAt: new Date().toISOString(),
          url: nextField(row.url, original, "url"),
          width: nextField(row.width, original, "width"),
        },
        sql: `
          UPDATE media
          SET
            filename = :filename,
            url = :url,
            mime_type = :mimeType,
            filesize = :filesize,
            width = :width,
            height = :height,
            sizes_card_filename = :cardFilename,
            sizes_card_url = :cardUrl,
            sizes_card_mime_type = :cardMimeType,
            sizes_card_filesize = :cardFilesize,
            sizes_card_width = :cardWidth,
            sizes_card_height = :cardHeight,
            sizes_thumb_filename = :thumbFilename,
            sizes_thumb_url = :thumbUrl,
            sizes_thumb_mime_type = :thumbMimeType,
            sizes_thumb_filesize = :thumbFilesize,
            sizes_thumb_width = :thumbWidth,
            sizes_thumb_height = :thumbHeight,
            updated_at = :updatedAt
          WHERE id = :id
        `,
      });
    }

    updated += 1;
    console.log(
      `${dryRun ? "Would update" : "Updated"} media ${row.id}: saved ${(
        ((original?.saved || 0) + (card?.saved || 0) + (thumb?.saved || 0)) /
        1024 /
        1024
      ).toFixed(2)} MB`,
    );
  }

  console.log(`${dryRun ? "Dry run" : "Completed"} media optimization.`);
  console.log(`Updated media records: ${updated}`);
  console.log(`Skipped media records: ${skipped}`);
  console.log(`Estimated saved bytes: ${savedBytes}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
