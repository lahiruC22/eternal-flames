"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
}

interface DescriptionCardsProps {
  memory: Memory;
  currentIndex: number;
}

export function DescriptionCards({ memory, currentIndex }: DescriptionCardsProps) {
  return (
    <>
      {/* Desktop Description - Right Side */}
      <div className="absolute right-8 top-1/2 z-10 hidden w-80 -translate-y-1/2 md:right-12 md:block lg:right-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white p-8 shadow-xl"
          >
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary">
              {memory.title}
            </h2>
            <Sparkles size={18} className="mb-4 text-primary" strokeWidth={1.5} />
            <p className="font-sans italic leading-relaxed text-foreground/70">
              &ldquo;{memory.caption}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Description - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mx-4 mb-20 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-3 font-serif text-xl font-bold text-primary">
              {memory.title}
            </h2>
            <Sparkles size={16} className="mb-3 text-primary" strokeWidth={1.5} />
            <p className="font-sans text-sm italic leading-relaxed text-foreground/70">
              &ldquo;{memory.caption}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
