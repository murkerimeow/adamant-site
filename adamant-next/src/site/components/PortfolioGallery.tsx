"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortfolioGalleryImage = {
  alt: string;
  fullSrc?: string;
  src: string;
};

type PortfolioGalleryProps = {
  images: PortfolioGalleryImage[];
};

export function PortfolioGallery({ images }: PortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  if (!images.length) return null;

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  };
  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  };

  return (
    <>
      <section
        className="portfolio-detail__gallery-section"
        aria-label="Фотографии объекта"
      >
        <div className="portfolio-detail__photo-grid">
          {images.map((image, index) => (
            <button
              key={`${image.src}-grid-${index}`}
              type="button"
              aria-label={`Открыть фотографию ${index + 1}`}
              aria-haspopup="dialog"
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </button>
          ))}
        </div>
      </section>

      {activeImage && activeIndex !== null
        ? createPortal(
            <div
              className="portfolio-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Фотография ${activeIndex + 1} из ${images.length}`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveIndex(null);
              }}
            >
              <button
                className="portfolio-lightbox__close"
                type="button"
                aria-label="Закрыть фотографию"
                onClick={() => setActiveIndex(null)}
                autoFocus
              >
                <span aria-hidden="true">×</span>
              </button>

              {images.length > 1 ? (
                <button
                  className="portfolio-lightbox__nav portfolio-lightbox__nav--prev"
                  type="button"
                  aria-label="Предыдущая фотография"
                  onClick={showPrevious}
                >
                  <span aria-hidden="true">←</span>
                </button>
              ) : null}

              <figure className="portfolio-lightbox__figure">
                <img src={activeImage.fullSrc ?? activeImage.src} alt={activeImage.alt} />
                <figcaption>
                  {activeIndex + 1} / {images.length}
                </figcaption>
              </figure>

              {images.length > 1 ? (
                <button
                  className="portfolio-lightbox__nav portfolio-lightbox__nav--next"
                  type="button"
                  aria-label="Следующая фотография"
                  onClick={showNext}
                >
                  <span aria-hidden="true">→</span>
                </button>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
