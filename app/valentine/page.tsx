"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { SceneWrapper } from "@/app/components/scene-wrapper";
import { RosePetalParticles } from "@/app/components/rose-petal-particles";
import { ArchiveGrid } from "@/components/archive-grid";
import { AddMemoryDialog } from "@/components/add-memory-dialog";
import { ValentineHeader } from "./components/valentine-header";
import { ValentineFooter } from "./components/valentine-footer";
import { TimelineNavigation } from "./components/timeline-navigation";
import { CentralImage } from "./components/central-image";
import { DescriptionCards } from "./components/description-cards";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;   // For placeholder images
  imageUrl?: string;  // For custom uploaded images
}

function ValentinePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [timelineData, setTimelineData] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentIndex = Number(searchParams.get('memory')) || 0;
  const isArchiveOpen = searchParams.get('archive') === 'true';

  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const updateURL = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    
    router.push(`?${current.toString()}`, { scroll: false });
  };

  // Fetch memories from database
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/memories');
        if (!response.ok) {
          throw new Error('Failed to fetch memories');
        }
        const data = await response.json();
        setTimelineData(data.memories.map((m: { id: string; title: string; date: string; caption: string; description: string; image_url: string }) => ({
          id: m.id,
          title: m.title,
          date: m.date,
          caption: m.caption,
          description: m.description,
          imageUrl: m.image_url,
        })));
      } catch (error) {
        console.error('Error fetching memories:', error);
        toast({
          title: "Error",
          description: "Failed to load memories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, [toast]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % timelineData.length;
    updateURL({ memory: nextIndex.toString() });
  };

  const handleArchiveSelect = (index: number) => {
    updateURL({ memory: index.toString(), archive: null });
  };

  const handleOpenAddMemory = () => {
    setIsAddMemoryOpen(true);
  };

  const handleAddMemory = async (memory: {
    title: string;
    date: string;
    caption: string;
    imageUrl: string;
  }) => {
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: memory.title,
          date: memory.date,
          caption: memory.caption,
          description: memory.caption,
          imageUrl: memory.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create memory');
      }

      const { memory: newMemory } = await response.json();
      
      const formattedMemory: Memory = {
        id: newMemory.id,
        title: newMemory.title,
        date: newMemory.date,
        caption: newMemory.caption,
        description: newMemory.description,
        imageUrl: newMemory.image_url,
      };

      setTimelineData([...timelineData, formattedMemory]);
      
      toast({
        title: "Success",
        description: "Memory added successfully!",
      });
    } catch (error) {
      console.error('Error adding memory:', error);
      toast({
        title: "Error",
        description: "Failed to add memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-primary">Loading memories...</div>
      </div>
    );
  }

  if (timelineData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-primary mb-4">No memories yet. Start creating your story!</p>
          <button
            onClick={() => setIsAddMemoryOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Add First Memory
          </button>
          <AddMemoryDialog
            isOpen={isAddMemoryOpen}
            onClose={() => setIsAddMemoryOpen(false)}
            onAdd={handleAddMemory}
          />
        </div>
      </div>
    );
  }

  const currentMemory = timelineData[currentIndex];

  const handleClearSelection = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, [contenteditable='true']")) {
      return;
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      selection.removeAllRanges();
    }
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background"
      onMouseDown={handleClearSelection}
    >
      <SceneWrapper className="pointer-events-none absolute inset-0 z-0">
        <ambientLight intensity={0.5} />
        <RosePetalParticles />
      </SceneWrapper>

      <ValentineHeader onOpenArchive={() => updateURL({ archive: 'true' })} />

      <TimelineNavigation
        memories={timelineData}
        currentIndex={currentIndex}
        onSelectMemory={(index) => updateURL({ memory: index.toString() })}
      />

      <CentralImage
        memory={currentMemory}
        currentIndex={currentIndex}
        onNext={handleNext}
      />

      <DescriptionCards
        memory={currentMemory}
        currentIndex={currentIndex}
      />

      <ValentineFooter />

      <ArchiveGrid
        isOpen={isArchiveOpen}
        onClose={() => updateURL({ archive: null })}
        onSelect={handleArchiveSelect}
        onAddMemory={handleOpenAddMemory}
        memories={timelineData}
      />

      <AddMemoryDialog
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAdd={handleAddMemory}
      />
    </div>
  );
}

export default function ValentinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <ValentinePageContent />;
}
