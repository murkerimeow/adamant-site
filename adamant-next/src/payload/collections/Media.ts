import path from "path";

import type { CollectionBeforeOperationHook, CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { formatSlug } from "../utilities/formatSlug.ts";

const imageFormatOptions = {
  format: "webp" as const,
  options: {
    quality: 76,
  },
};

type UploadFile = {
  name?: string;
};

function normalizeFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  const baseName = extension ? filename.slice(0, -extension.length) : filename;
  const slug = formatSlug(baseName) || "media";

  return `${slug}${extension}`;
}

const normalizeUploadedFilename: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (operation !== "create" && operation !== "update") {
    return args;
  }

  const requestFile = req.file as UploadFile | undefined;

  if (requestFile?.name) {
    requestFile.name = normalizeFilename(requestFile.name);
  }

  const requestFiles = req.files as
    | Record<string, UploadFile | UploadFile[]>
    | undefined;

  Object.values(requestFiles ?? {}).forEach((fileOrFiles) => {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    files.forEach((file) => {
      if (file?.name) {
        file.name = normalizeFilename(file.name);
      }
    });
  });

  return args;
};

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    defaultColumns: ["filename", "alt", "updatedAt"],
    group: "Система",
    useAsTitle: "alt",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeOperation: [normalizeUploadedFilename],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt-текст",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
      label: "Подпись",
    },
  ],
  upload: {
    adminThumbnail: "card",
    formatOptions: imageFormatOptions,
    imageSizes: [
      {
        name: "card",
        width: 1280,
        formatOptions: imageFormatOptions,
        withoutEnlargement: true,
      },
      {
        name: "thumb",
        width: 600,
        formatOptions: imageFormatOptions,
        withoutEnlargement: true,
      },
    ],
    mimeTypes: [
      "image/*",
      "video/*",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "model/*",
      "model/gltf-binary",
      "model/gltf+json",
      "application/octet-stream",
      ".glb",
      ".gltf",
    ],
    staticDir: path.resolve(process.cwd(), "media"),
  },
};
