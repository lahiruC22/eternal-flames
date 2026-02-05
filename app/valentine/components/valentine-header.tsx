"use client";

import { Grid2x2 } from "lucide-react";

interface ValentineHeaderProps {
  onOpenArchive: () => void;
}

export function ValentineHeader({ onOpenArchive }: ValentineHeaderProps) {
  return (
    <>
      <header className="absolute left-4 top-6 z-10 sm:left-8 sm:top-8 md:left-12 md:top-12">
        <h1 className="font-serif text-xs uppercase tracking-[0.3em] text-foreground/60 sm:text-sm">
          Our Story
        </h1>
      </header>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenArchive();
        }}
        className="absolute right-4 top-6 z-10 rounded-full p-2 hover:bg-foreground/10 sm:right-8 sm:top-8 md:right-12 md:top-12"
        aria-label="Open archive"
      >
        <Grid2x2 size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
      </button>
    </>
  );
}
