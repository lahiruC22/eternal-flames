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
    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-full px-4 md:w-auto md:px-0">
      <AnimatePresence mode="wait">
        <motion.button
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            scale: 0.85,
            y: 20
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.85,
            y: -20
          }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.6
          }}
          whileHover={{ 
            scale: 1.02,
            y: -5,
            transition: { duration: 0.3 }
          }}
          onClick={onNext}
          className="relative h-[200px] w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl group sm:h-[250px] md:h-[400px] md:w-[700px]"
        >
          {/* Romantic glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-rose-400/0 via-transparent to-rose-400/0 pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          
          <Image
            src={
              memory.imageUrl || 
              `https://picsum.photos/seed/${memory.imageId}/1400/800`
            }
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 700px"
            className="object-cover group-hover:brightness-110 transition-all duration-300"
            priority={currentIndex === 0}
          />
          
          {/* Subtle shine effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 pointer-events-none"
            whileHover={{ 
              opacity: 0.1,
              x: ["-100%", "100%"]
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
