"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { JourneyTimeline } from "@/components/journey-timeline";
import { ValentineDisplay } from "@/app/components/valentine-display";
import { ArchiveGrid } from "@/components/archive-grid";
import { AddMemoryDialog } from "@/components/add-memory-dialog";
import { JourneyHeader } from "@/app/components/journey-header";
import { JourneyFooter } from "@/app/components/journey-footer";
import { MemoryDescription } from "@/app/components/memory-description";
import { NavigationButtons } from "@/app/components/navigation-buttons";

interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  caption: string;
  imageId: string;
}

interface InteractiveJourneyProps {
  timelineData: Memory[];
}

export function InteractiveJourney({ timelineData }: InteractiveJourneyProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music.mp3")
    audio.loop = true;

    audioRef.current = audio;

    return () => {
        audio.pause();
        audio.src = '';
    };
  }, []);

  const handleNext = useCallback((): void => {
    setCurrentIndex((prev) => (prev + 1) % timelineData.length);
  }, [timelineData.length]);

  const handlePrev = useCallback((): void => {
    setCurrentIndex(
      (prev) => (prev - 1 + timelineData.length) % timelineData.length,
    );
  }, [timelineData.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  const handleAdvance = (e: React.MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [data-prevent-advance="true"]')) {
      return;
    }
    if (audioRef.current?.paused) {
      void audioRef.current.play();
    }
    handleNext();
  };

  const toggleMute = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleArchiveSelect = (index: number): void => {
    setCurrentIndex(index);
    setIsArchiveOpen(false);
  };

  const handleOpenAddMemory = (): void => {
    setIsAddMemoryOpen(true);
  };

  const handleAddMemory = async (_memory: {
    title: string;
    date: string;
    caption: string;
    imageUrl: string;
  }): Promise<void> => {
    // Implementation to add memory goes here
    setIsAddMemoryOpen(false);
  };

  const currentMemory = timelineData[currentIndex];
  const isEven = currentIndex % 2 === 0;

  return (
    <main
      className="relative min-h-screen w-full cursor-pointer overflow-hidden bg-background text-foreground"
      onClick={handleAdvance}
      role="presentation"
      aria-label="Click or use arrow buttons to navigate memories"
    >
      <ArchiveGrid
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onSelect={handleArchiveSelect}
        onAddMemory={handleOpenAddMemory}
        memories={timelineData}
      />

      <motion.div
        key="main-app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none relative z-10 flex h-screen w-full flex-col p-4 sm:p-8 md:p-12"
      >
        <JourneyHeader onOpenArchive={() => setIsArchiveOpen(true)} />

        <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 md:left-12 md:block">
          <JourneyTimeline
            current={currentIndex}
            total={timelineData.length}
          />
        </div>

        <JourneyFooter isMuted={isMuted} onToggleMute={toggleMute} />
      </motion.div>

      <MemoryDescription
        memory={currentMemory}
        currentIndex={currentIndex}
        isEven={isEven}
      />

      <Suspense fallback={null}>
        <ValentineDisplay currentIndex={currentIndex} />
      </Suspense>

      <NavigationButtons onPrev={handlePrev} onNext={handleNext} />

      <AddMemoryDialog
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAdd={handleAddMemory}
      />
    </main>
  );
}
