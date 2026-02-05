"use client";

import { Grid2x2 } from "lucide-react";

interface JourneyHeaderProps {
  onOpenArchive: () => void;
}

export function JourneyHeader({ onOpenArchive }: JourneyHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div className="font-serif text-lg uppercase tracking-[0.3em]">
        Our Story
      </div>
      <nav className="pointer-events-auto flex items-center gap-8 text-sm uppercase tracking-widest">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenArchive();
          }}
          className="rounded-full p-2 hover:bg-foreground/10"
          aria-label="Open archive"
        >
          <Grid2x2 size={20} />
        </button>
      </nav>
    </header>
  );
}
