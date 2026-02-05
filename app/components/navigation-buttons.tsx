"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationButtons({ onPrev, onNext }: NavigationButtonsProps) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="fixed left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:left-8"
        aria-label="Previous memory"
      >
        <ArrowLeft size={24} />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="fixed right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:right-8"
        aria-label="Next memory"
      >
        <ArrowRight size={24} />
      </button>
    </>
  );
}
