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
                <img src={image.src} alt={image.alt} />
              </figure>
            ))}
          </div>
        </div>

        {showControls ? (
          <>
            <button
              className="product-gallery__nav product-gallery__nav--prev"
              type="button"
              aria-label="Previous image"
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
              aria-label="Next image"
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
      </div>

      {showControls ? (
        <div
          className="product-gallery__thumbs"
          role="tablist"
          aria-label={`${title} thumbnails`}
        >
          {images.map((image, index) => (
            <button
              key={`${image.thumbSrc ?? image.src}-thumb-${index}`}
              className="product-gallery__thumb"
              data-active={activeIndex === index ? "true" : "false"}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Image ${index + 1}`}
              onClick={() => scrollToIndex(index)}
            >
              <img src={image.thumbSrc ?? image.src} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

      {showControls ? (
        <div className="product-gallery__dots" aria-hidden="true">
          {images.map((image, index) => (
            <span
              key={`${image.src}-dot-${index}`}
              data-active={activeIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
