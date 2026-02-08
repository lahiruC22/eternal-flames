'use client';

import { MemoryCard } from './memory-card';
import { getMasonryPattern } from '@/lib/masonry-utils';

interface MemoriesGridProps {
  memories: Array<{
    id: string;
    title: string;
    date: string;
    caption: string;
    description: string;
    imageId?: string;
    imageUrl?: string;
    imageFocusX?: number | null;
    imageFocusY?: number | null;
  }>;
  onSelect: (index: number) => void;
}

/**
 * Memories Grid Component
 * Renders memories in responsive masonry layout
 */
export function MemoriesGrid({ memories, onSelect }: MemoriesGridProps) {
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-6 auto-rows-[300px] md:grid-cols-3">
        {memories.map((item, index) => {
          const { isWide } = getMasonryPattern(index);

          return (
            <MemoryCard
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              caption={item.caption}
              description={item.description}
              imageId={item.imageId}
              imageUrl={item.imageUrl}
              imageFocusX={item.imageFocusX}
              imageFocusY={item.imageFocusY}
              isWide={isWide}
              onClick={() => onSelect(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
