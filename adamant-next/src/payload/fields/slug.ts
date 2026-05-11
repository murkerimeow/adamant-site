import type { TextField } from "payload";

import { formatSlug } from "../utilities/formatSlug.ts";

export const slugField = (fallbackField = "title"): TextField => ({
  name: "slug",
  type: "text",
  admin: {
    position: "sidebar",
  },
  hooks: {
    beforeValidate: [
      ({ data, siblingData, value }) => {
        const fallbackValue =
          typeof data?.[fallbackField] === "string"
            ? data[fallbackField]
            : typeof siblingData?.[fallbackField] === "string"
              ? siblingData[fallbackField]
              : "";

        if (typeof value === "string" && value.length > 0) {
          return formatSlug(value);
        }

        return formatSlug(fallbackValue);
      },
    ],
  },
  index: true,
  label: "Slug",
  required: true,
  unique: true,
});
