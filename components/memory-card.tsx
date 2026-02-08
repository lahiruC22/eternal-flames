'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { FocusPoint } from '@/hooks/use-image-focus';
import { useImageFocus } from '@/hooks/use-image-focus';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MemoryCardProps {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
  imageFocusX?: number | null;
  imageFocusY?: number | null;
  isWide: boolean;
  onClick: () => void;
}

/**
 * Get image by ID from placeholder images
 */
export const getImageById = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

function resolveExistingFocus(
  imageFocusX?: number | null,
  imageFocusY?: number | null
): FocusPoint | null {
  if (imageFocusX === null || imageFocusX === undefined) {
    return null;
  }

  if (imageFocusY === null || imageFocusY === undefined) {
    return null;
  }

  return { x: imageFocusX, y: imageFocusY };
}

function getObjectPosition(
  focus: FocusPoint | null,
  isPortrait: boolean | null
): string {
  if (focus) {
    return `${(focus.x * 100).toFixed(2)}% ${(focus.y * 100).toFixed(2)}%`;
  }

  return isPortrait ? 'center top' : 'center';
}

function getImageMeta(
  imageId: string | undefined,
  imageUrl: string | undefined,
  title: string
): { src: string; alt: string } {
  const image = imageId ? getImageById(imageId) : null;
  return {
    src: imageUrl || image?.imageUrl || '',
    alt: title || image?.alt || '',
  };
}

/**
 * Memory Card Component
 * Displays individual memory with hover effects and gradient overlay
 */
export function MemoryCard({
  id: _id,
  title,
  date,
  caption,
  imageId,
  imageUrl,
  imageFocusX,
  imageFocusY,
  isWide,
  onClick,
}: MemoryCardProps) {
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const imageMeta = getImageMeta(imageId, imageUrl, title);
  const existingFocus = resolveExistingFocus(imageFocusX, imageFocusY);

  const { focus, registerImage } = useImageFocus({
    imageUrl: imageMeta.src,
    existingFocus,
    memoryId: _id,
    enabled: Boolean(imageMeta.src),
  });

  const objectPosition = getObjectPosition(focus, isPortrait);

  const colSpan = isWide ? 'col-span-2' : 'col-span-1';

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl ${colSpan}`}
      onClick={onClick}
    >
      <Image
        src={imageMeta.src}
        alt={imageMeta.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition }}
        onLoadingComplete={(img) => {
          const nextIsPortrait = img.naturalHeight > img.naturalWidth;
          setIsPortrait((prev) => (prev === nextIsPortrait ? prev : nextIsPortrait));
          registerImage(img);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-serif text-lg font-semibold text-white drop-shadow-lg">
          {date}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-white/95 drop-shadow-md">
          {caption}
        </p>
      </div>
    </div>
  );
}
