"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function Moving() {
  return (
    <InfiniteMovingCards
      items={[
        "/thumbnails/1.jpeg",
        "/thumbnails/2.jpeg",
        "/thumbnails/3.jpeg",
        "/thumbnails/1.jpeg",
        "/thumbnails/2.jpeg",
        "/thumbnails/3.jpeg",
      ]}
      direction="right"
      speed="slow"
    />
  );
}
