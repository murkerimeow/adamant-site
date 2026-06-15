"use client";

import { useRef, useState } from "react";

type HomePortfolioCategory = {
  label: string;
  value: string;
};

type HomePortfolioCategoriesProps = {
  categories: HomePortfolioCategory[];
};

export function HomePortfolioCategories({
  categories,
}: HomePortfolioCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const navRef = useRef<HTMLElement>(null);

  const selectCategory = (category: string) => {
    setActiveCategory(category);

    const section = navRef.current?.closest<HTMLElement>("[data-home-portfolio]");
    const slider = section?.querySelector<HTMLElement>(".home-portfolio-strip");
    const emptyState = section?.querySelector<HTMLElement>("[data-portfolio-empty]");
    let visibleCards = 0;

    section
      ?.querySelectorAll<HTMLElement>("[data-portfolio-category]")
      .forEach((card) => {
        const isVisible =
          category === "all" || card.dataset.portfolioCategory === category;

        card.hidden = !isVisible;
        if (isVisible) visibleCards += 1;
      });

    if (emptyState) {
      emptyState.hidden = visibleCards > 0;
    }

    slider?.scrollTo({ left: 0, behavior: "smooth" });

    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  return (
    <nav
      ref={navRef}
      className="home-portfolio-tabs"
      aria-label="Направления выполненных работ"
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
          key={category.value}
          className={activeCategory === category.value ? "is-active" : undefined}
          type="button"
          aria-pressed={activeCategory === category.value}
          onClick={() => selectCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}
