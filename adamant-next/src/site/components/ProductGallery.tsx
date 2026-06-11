"use client";

import { useEffect, useRef, useState } from "react";

export type ProductGalleryImage = {
  alt: string;
  src: string;
  thumbSrc?: string;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateActiveIndex = () => {
      const slideWidth = viewport.clientWidth;

      if (!slideWidth) {
        return;
      }

      const nextIndex = Math.round(viewport.scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(images.length - 1, nextIndex)));
    };

    updateActiveIndex();
    viewport.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", updateActiveIndex);
    };
  }, [images.length]);

  const scrollToIndex = (index: number) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const slide = viewport.querySelector<HTMLElement>(
      `[data-gallery-slide="${index}"]`,
    );

    if (!slide) {
      return;
    }

    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(index);
  };

  const showControls = images.length > 1;
  const previewIndexes = images
    .map((_, index) => index)
    .filter((index) => index !== activeIndex)
    .slice(0, 3);
  const visiblePreviewIndexes = previewIndexes.length ? previewIndexes : [activeIndex];
  const hiddenCount = Math.max(0, images.length - 4);

  return (
    <div
      className="product-gallery"
      data-gallery-size={showControls ? "multiple" : "single"}
    >
      <div className="product-gallery__shell">
        <div
          ref={viewportRef}
          className="product-gallery__viewport"
          role="region"
          aria-label={`${title} gallery`}
        >
          <div className="product-gallery__track">
            {images.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className="product-gallery__slide"
                data-gallery-slide={index}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </figure>
            ))}
          </div>
        </div>

        {showControls ? (
          <>
            <button
              className="product-gallery__nav product-gallery__nav--prev"
              type="button"
              aria-label="Предыдущее фото"
              onClick={() =>
                scrollToIndex(
                  activeIndex === 0 ? images.length - 1 : activeIndex - 1,
                )
              }
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="product-gallery__nav product-gallery__nav--next"
              type="button"
              aria-label="Следующее фото"
              onClick={() =>
                scrollToIndex(
                  activeIndex === images.length - 1 ? 0 : activeIndex + 1,
                )
              }
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}

        <span className="product-gallery__counter">
          {activeIndex + 1}/{images.length}
        </span>

        {showControls ? (
          <div className="product-gallery__bars" aria-label="Переключение фото">
            {images.map((image, index) => (
              <button
                key={`${image.src}-bar-${index}`}
                className="product-gallery__bar"
                type="button"
                aria-label={`Открыть фото ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {showControls ? (
        <div className="product-gallery__dots" aria-label="Gallery navigation">
          {images.map((image, index) => (
            <button
              key={`${image.src}-dot-${index}`}
              className="product-gallery__dot"
              type="button"
              aria-label={`Open image ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      ) : null}

      <div className="product-gallery__side" aria-label={`${title} thumbnails`}>
        {visiblePreviewIndexes.map((index, slot) => {
          const image = images[index];

          return (
            <button
              key={`${image.thumbSrc ?? image.src}-preview-${index}`}
              className={`product-gallery__preview product-gallery__preview--${slot + 1}`}
              type="button"
              aria-label={`Открыть фото ${index + 1}`}
              onClick={() => scrollToIndex(index)}
            >
              <img
                src={image.thumbSrc ?? image.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              {slot === visiblePreviewIndexes.length - 1 && hiddenCount > 0 ? (
                <span>
                  <strong>+{hiddenCount}</strong>
                  фотогалерея
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
