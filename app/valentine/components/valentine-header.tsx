"use client";

import { Grid2x2 } from "lucide-react";

interface ValentineHeaderProps {
  onOpenArchive: () => void;
}

export function ValentineHeader({ onOpenArchive }: ValentineHeaderProps) {
  return (
    <>
      <header className="absolute left-8 top-8 z-10 md:left-12 md:top-12">
        <h1 className="font-serif text-sm uppercase tracking-[0.3em] text-foreground/60">
          Our Story
        </h1>
      </header>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenArchive();
        }}
        className="absolute right-8 top-8 z-10 rounded-full p-2 hover:bg-foreground/10 md:right-12 md:top-12"
        aria-label="Open archive"
      >
        <Grid2x2 size={20} className="text-foreground/60" />
      </button>
    </>
  );
}
