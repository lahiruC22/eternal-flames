"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  caption: string;
  imageId: string;
}

interface MemoryDescriptionProps {
  memory: Memory;
  currentIndex: number;
  isEven: boolean;
}

export function MemoryDescription({ memory, currentIndex, isEven }: MemoryDescriptionProps) {
  return (
    <>
      {/* Desktop View */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex">
        <div className="relative w-full max-w-6xl px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                },
              }}
              exit={{
                opacity: 0,
                x: isEven ? -50 : 50,
                transition: { duration: 0.5 },
              }}
              className={`absolute top-1/2 w-72 -translate-y-1/2 select-none ${
                isEven ? "left-12" : "right-12"
              }`}
            >
              <div className="relative rounded-lg bg-background/80 p-6 shadow-xl backdrop-blur-md">
                <p className="font-serif text-xl text-foreground">
                  {memory.date}
                </p>
                <Sparkles
                  size={18}
                  className={`my-3 text-primary ${isEven && "ml-auto"}`}
                  strokeWidth={1.5}
                />
                <p className="text-lg italic text-foreground/80">
                  &ldquo;{memory.caption}&rdquo;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile View */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
            className="w-full max-w-sm select-none p-4 pb-20 text-center"
          >
            <div className="relative rounded-lg bg-background/80 p-6 shadow-xl backdrop-blur-md">
              <p className="font-serif text-xl text-foreground">
                {memory.date}
              </p>
              <Sparkles
                size={18}
                className="mx-auto my-3 text-primary"
                strokeWidth={1.5}
              />
              <p className="text-base italic text-foreground/80">
                &ldquo;{memory.caption}&rdquo;
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
