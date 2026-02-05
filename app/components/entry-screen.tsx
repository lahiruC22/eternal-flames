"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface EntryScreenProps {
  isMusicReady: boolean;
  onEnter: () => Promise<void>;
}

export function EntryScreen({ isMusicReady, onEnter }: EntryScreenProps) {
  return (
    <motion.div
      key="entry"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background"
    >
      <h1 className="font-serif text-5xl text-primary md:text-7xl">
        Our Journey
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A Valentine&apos;s Story
      </p>
      <Button
        onClick={onEnter}
        disabled={!isMusicReady}
        size="lg"
        className="mt-12 uppercase tracking-widest"
        variant="outline"
      >
        {isMusicReady ? (
          "Begin Journey"
        ) : (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Preparing...
          </>
        )}
      </Button>
    </motion.div>
  );
}
