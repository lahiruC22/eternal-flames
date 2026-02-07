"use client";

import { Volume2, VolumeX, Share2 } from "lucide-react";
import { useMusic } from "@/components/music-provider";

export function ValentineFooter() {
  const { isMuted, toggleMute } = useMusic();

  return (
    <footer className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8 md:bottom-12 md:left-12 md:right-12">
      <div className="font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 sm:text-xs">
        <span className="hidden sm:inline">Our Valentine&apos;s Story</span>
        <span className="sm:hidden">Our Story</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleMute}
          className="rounded-full p-1.5 hover:bg-foreground/10 sm:p-2"
          aria-label="Toggle music"
        >
          {isMuted ? (
            <VolumeX size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
          ) : (
            <Volume2 size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
          )}
        </button>
        <button
          className="rounded-full p-1.5 hover:bg-foreground/10 sm:p-2"
          aria-label="Share"
        >
          <Share2 size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
        </button>
      </div>
    </footer>
  );
}
