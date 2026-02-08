'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MemoriesGrid } from './memories-grid';

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

/**
 * Archive Grid Dialog Component
 * Displays memories in masonry layout within a dialog
 */
export function ArchiveGrid({
  isOpen,
  onClose,
  onSelect,
  onAddMemory,
  memories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
  onAddMemory: () => void;
  memories: Memory[];
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[1100px] w-[92vw] bg-[#e8d5d5]/98 p-12 backdrop-blur-md"
        data-prevent-advance="true"
      >
        <div className="mb-6">
          <DialogTitle className="font-serif text-4xl font-bold text-[#e84c6f] mb-2">
            Memory Archive
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/60">
            A collection of our treasured moments.
          </DialogDescription>
        </div>

        <MemoriesGrid memories={memories} onSelect={onSelect} />

        <div className="mt-8 flex justify-end">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddMemory();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Memory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
