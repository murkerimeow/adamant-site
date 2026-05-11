"use client";

import { useEffect } from "react";

type BodyClassNameProps = {
  className?: string;
};

export function BodyClassName({ className }: BodyClassNameProps) {
  useEffect(() => {
    if (!className) return;

    const classes = className.split(/\s+/).filter(Boolean);
    if (!classes.length) return;

    document.body.classList.add(...classes);

    return () => {
      document.body.classList.remove(...classes);
    };
  }, [className]);

  return null;
}
