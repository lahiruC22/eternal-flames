"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FocusPoint } from "@/hooks/use-image-focus";
import { useImageFocus } from "@/hooks/use-image-focus";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
  imageFocusX?: number | null;
  imageFocusY?: number | null;
}

interface CentralImageProps {
  memory: Memory;
  currentIndex: number;
  onNext: () => void;
}

function resolveExistingFocus(memory: Memory): FocusPoint | null {
  if (memory.imageFocusX === null || memory.imageFocusX === undefined) {
    return null;
  }

  if (memory.imageFocusY === null || memory.imageFocusY === undefined) {
    return null;
  }

  return { x: memory.imageFocusX, y: memory.imageFocusY };
}

function getObjectPosition(
  focus: FocusPoint | null,
  isPortrait: boolean | null
): string {
  if (focus) {
    return `${(focus.x * 100).toFixed(2)}% ${(focus.y * 100).toFixed(2)}%`;
  }

  return isPortrait ? "center top" : "center";
}

function getFrameClassName(isPortrait: boolean | null): string {
  return isPortrait
    ? "h-[260px] sm:h-[320px] md:h-[520px] md:w-[520px]"
    : "h-[200px] sm:h-[250px] md:h-[400px] md:w-[700px]";
}

export function CentralImage({ memory, currentIndex, onNext }: CentralImageProps) {
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const imageSrc =
    memory.imageUrl || `https://picsum.photos/seed/${memory.imageId}/1400/800`;

  const existingFocus = resolveExistingFocus(memory);

  const { focus, registerImage } = useImageFocus({
    imageUrl: imageSrc,
    existingFocus,
    memoryId: memory.id,
    enabled: Boolean(imageSrc),
  });

  const frameClassName = getFrameClassName(isPortrait);
  const objectPosition = getObjectPosition(focus, isPortrait);

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
          className={`relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl group ${frameClassName}`}
        >
          {/* Cinematic blurred backdrop */}
          <div className="absolute inset-0 scale-110">
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 700px"
              className="object-cover blur-2xl brightness-90"
              style={{ objectPosition }}
              aria-hidden="true"
            />
          </div>

          {/* Romantic glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-rose-400/0 via-transparent to-rose-400/0 pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          
          <Image
            src={imageSrc}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 700px"
            className="object-cover group-hover:brightness-110 transition-all duration-300"
            style={{ objectPosition }}
            onLoadingComplete={(img) => {
              const nextIsPortrait = img.naturalHeight > img.naturalWidth;
              setIsPortrait((prev) => (prev === nextIsPortrait ? prev : nextIsPortrait));
              registerImage(img);
            }}
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
