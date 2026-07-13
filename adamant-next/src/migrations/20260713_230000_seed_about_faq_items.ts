import { type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-sqlite";

type FaqItem = {
  answer?: string;
  id?: string | null;
  question?: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Сколько стоит работа и от чего зависит цена?",
    answer:
      "Стоимость рассчитываем индивидуально — зависит от объёма, материалов и сложности. Смета прозрачная, без скрытых доплат.",
  },
  {
    question: "Можно ли сделать расчёт без выезда?",
    answer:
      "Да. Вы присылаете фото, план или описание — мы делаем предварительный расчёт и подскажем оптимальные решения.",
  },
  {
    question: "Работаете по договору?",
    answer:
      "Да, всегда. В договоре фиксируем стоимость, сроки и гарантию — всё официально и прозрачно.",
  },
  {
    question: "Какие гарантии вы даёте?",
    answer:
      "Гарантия зависит от вида работ. Всегда прописываем её в договоре и отвечаем за качество. Срок гарантии — от 2 лет.",
  },
  {
    question: "Поможете с выбором материалов?",
    answer:
      "Да. Подскажем, что лучше подойдёт под ваш бюджет и задачу, объясним плюсы и минусы каждого варианта.",
  },
];

const faqQuestions = new Set(faqItems.map((item) => item.question));

function withoutSeededFaqItems(items: Array<FaqItem | undefined> | null | undefined) {
  return (items ?? []).filter((item): item is FaqItem => Boolean(item && !faqQuestions.has(item.question)));
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const aboutPage = await payload.findGlobal({
    slug: "about-page",
    depth: 0,
    req,
  });

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      faqItems: [...faqItems, ...withoutSeededFaqItems(aboutPage.faqItems)],
    },
    depth: 0,
    overrideAccess: true,
    req,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const aboutPage = await payload.findGlobal({
    slug: "about-page",
    depth: 0,
    req,
  });

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      faqItems: withoutSeededFaqItems(aboutPage.faqItems),
    },
    depth: 0,
    overrideAccess: true,
    req,
  });
}
