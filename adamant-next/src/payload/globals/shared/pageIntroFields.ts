import type { Field } from "payload";

type PageIntroDefaults = {
  eyebrow: string;
  subtitle: string;
  title: string;
};

export function buildPageIntroFields(
  defaults: PageIntroDefaults,
  titleLabel = "Заголовок страницы",
): Field[] {
  return [
    {
      name: "eyebrow",
      type: "text",
      defaultValue: defaults.eyebrow,
      label: "Лейбл",
      required: true,
    },
    {
      name: "title",
      type: "textarea",
      defaultValue: defaults.title,
      label: titleLabel,
      required: true,
    },
    {
      name: "subtitle",
      type: "textarea",
      defaultValue: defaults.subtitle,
      label: "Подзаголовок",
      required: true,
    },
  ];
}
