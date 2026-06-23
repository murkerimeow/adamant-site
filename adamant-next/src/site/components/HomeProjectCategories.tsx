"use client";

import { useRef, useState } from "react";

type HomeProjectCategory = {
  id: number | string;
  slug: string;
  title: string;
};

type HomeProjectCategoriesProps = {
  categories: HomeProjectCategory[];
};

export function HomeProjectCategories({ categories }: HomeProjectCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const navRef = useRef<HTMLElement>(null);

  const selectCategory = (category: string) => {
    setActiveCategory(category);

    const section = navRef.current?.closest<HTMLElement>("[data-home-projects]");
    const slider = section?.querySelector<HTMLElement>(".home-project-preview__grid");

    section
      ?.querySelectorAll<HTMLElement>("[data-home-project-category]")
      .forEach((card) => {
        const isVisible =
          category === "all"
            ? card.dataset.homeProjectDefault === "true"
            : card.dataset.homeProjectCategory === category;

        card.hidden = !isVisible;
        card.classList.toggle("is-filtered-out", !isVisible);
      });

    slider?.scrollTo({ left: 0, behavior: "smooth" });

    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  return (
    <nav
      ref={navRef}
      className="home-project-preview__categories"
      aria-label="Категории проектов"
    >
      <button
        className={activeCategory === "all" ? "is-active" : undefined}
        type="button"
        aria-pressed={activeCategory === "all"}
        onClick={() => selectCategory("all")}
      >
        Все
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={activeCategory === category.slug ? "is-active" : undefined}
          type="button"
          aria-pressed={activeCategory === category.slug}
          onClick={() => selectCategory(category.slug)}
        >
          {category.title}
        </button>
      ))}
    </nav>
  );
}
