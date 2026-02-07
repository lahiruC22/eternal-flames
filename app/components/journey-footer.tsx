"use client";

import { Volume2, VolumeX, Share2 } from "lucide-react";
import { useMusic } from "@/components/music-provider";

export function JourneyFooter() {
  const { isMuted, toggleMute } = useMusic();

  return (
    <footer className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm uppercase tracking-widest sm:bottom-8 sm:left-8 sm:right-8 md:bottom-12 md:left-12 md:right-12">
      <div className="flex flex-col gap-1">
        <span>Our Valentine&apos;s Story</span>
        <span className="text-xs normal-case text-muted-foreground">
          Use ← → keys or click to navigate
        </span>
      </div>
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          aria-label="Toggle music"
          className="rounded-full p-2 hover:bg-foreground/10"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          aria-label="Share"
          className="rounded-full p-2 hover:bg-foreground/10"
        >
          <Share2 size={20} />
        </button>
      </div>
    </footer>
  );
}
