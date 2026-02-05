"use client";

import { Volume2, VolumeX, Share2 } from "lucide-react";

interface ValentineFooterProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export function ValentineFooter({ isMuted, onToggleMute }: ValentineFooterProps) {
  return (
    <footer className="absolute bottom-8 left-8 right-8 z-10 flex items-center justify-between md:bottom-12 md:left-12 md:right-12">
      <div className="font-serif text-xs uppercase tracking-[0.2em] text-foreground/60">
        Our Valentine&apos;s Story
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMute}
          className="rounded-full p-2 hover:bg-foreground/10"
          aria-label="Toggle music"
        >
          {isMuted ? (
            <VolumeX size={20} className="text-foreground/60" />
          ) : (
            <Volume2 size={20} className="text-foreground/60" />
          )}
        </button>
        <button
          className="rounded-full p-2 hover:bg-foreground/10"
          aria-label="Share"
        >
          <Share2 size={20} className="text-foreground/60" />
        </button>
      </div>
    </footer>
  );
}
