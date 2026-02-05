"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
}

interface CentralImageProps {
  memory: Memory;
  currentIndex: number;
  onNext: () => void;
}

export function CentralImage({ memory, currentIndex, onNext }: CentralImageProps) {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <AnimatePresence mode="wait">
        <motion.button
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6 }}
          onClick={onNext}
          className="relative h-[400px] w-[400px] cursor-pointer overflow-hidden rounded-full shadow-2xl transition-transform hover:scale-105 md:h-[500px] md:w-[500px]"
        >
          <Image
            src={
              memory.imageUrl || 
              `https://picsum.photos/seed/${memory.imageId}/800/800`
            }
            alt={memory.title}
            fill
            sizes="(max-width: 768px) 400px, 500px)"
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
