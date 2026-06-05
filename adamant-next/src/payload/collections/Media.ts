import path from "path";

import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";

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
    imageSizes: [
      { name: "card", width: 1280, height: 720 },
      { name: "thumb", width: 600, height: 400 },
    ],
    mimeTypes: ["image/*", "model/gltf-binary", "model/gltf+json", "application/octet-stream"],
    staticDir: path.resolve(process.cwd(), "media"),
  },
};
