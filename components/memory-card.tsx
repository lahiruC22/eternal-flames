'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MemoryCardProps {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
  isWide: boolean;
  onClick: () => void;
}

/**
 * Get image by ID from placeholder images
 */
export const getImageById = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

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
  isWide,
  onClick,
}: MemoryCardProps) {
  const image = imageId ? getImageById(imageId) : null;
  const imageSrc = imageUrl || image?.imageUrl || '';
  const imageAlt = title || image?.alt || '';

  const colSpan = isWide ? 'col-span-2' : 'col-span-1';

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl ${colSpan}`}
      onClick={onClick}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
