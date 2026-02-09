"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useMusic } from "@/components/music-provider";
import { SceneWrapper } from "@/app/components/scene-wrapper";
import dynamic from "next/dynamic";
const RosePetalParticles = dynamic(
  () => import("@/app/components/rose-petal-particles").then((mod) => mod.RosePetalParticles),
  { ssr: false, loading: () => null }
);
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
  imageFocusX?: number | null;
  imageFocusY?: number | null;
  imageAspectRatio?: number | null;
}

function ValentinePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { play, isReady } = useMusic();
  
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
    let isMounted = true;
    const fetchMemories = async () => {
      let cursor: string | undefined;
      let isFirstPage = true;
      try {
        while (isMounted) {
          const params = new URLSearchParams();
          params.set("limit", "50");
          if (cursor) {
            params.set("cursor", cursor);
          }

          const response = await fetch(`/api/memories?${params.toString()}`);
          if (!response.ok) {
            throw new Error('Failed to fetch memories');
          }

          const data = await response.json() as {
            memories: Array<{
              id: string;
              title: string;
              date: string;
              caption: string;
              description: string;
              image_url: string;
              image_focus_x: number | null;
              image_focus_y: number | null;
              image_aspect_ratio: number | null;
            }>;
            nextCursor?: string;
          };

          const mapped = data.memories.map((m) => ({
            id: m.id,
            title: m.title,
            date: m.date,
            caption: m.caption,
            description: m.description,
            imageUrl: m.image_url,
            imageFocusX: m.image_focus_x,
            imageFocusY: m.image_focus_y,
            imageAspectRatio: m.image_aspect_ratio,
          }));

          if (isFirstPage) {
            setTimelineData(mapped);
            isFirstPage = false;
          } else {
            setTimelineData((prev) => [...prev, ...mapped]);
          }

          cursor = data.nextCursor;
          if (!cursor) {
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
        toast({
          title: "Error",
          description: "Failed to load memories.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMemories();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const shouldAutoplay = window.sessionStorage.getItem("valentine_autoplay") === "true";
    if (!shouldAutoplay) {
      return;
    }

    const handleUserStart = () => {
      void play().then((started) => {
        if (started) {
          window.sessionStorage.removeItem("valentine_autoplay");
        }
      });
      window.removeEventListener("pointerdown", handleUserStart);
      window.removeEventListener("keydown", handleUserStart);
    };

    window.addEventListener("pointerdown", handleUserStart, { once: true });
    window.addEventListener("keydown", handleUserStart, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleUserStart);
      window.removeEventListener("keydown", handleUserStart);
    };
  }, [isReady, play]);

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

  useEffect(() => {
    if (timelineData.length === 0) {
      return;
    }

    const prefetchImage = (url?: string) => {
      if (!url) {
        return;
      }

      const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
      if (existing) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      link.setAttribute("data-prefetch", "true");
      document.head.appendChild(link);
    };

    const nextIndex = (currentIndex + 1) % timelineData.length;
    const prevIndex = (currentIndex - 1 + timelineData.length) % timelineData.length;

    prefetchImage(timelineData[nextIndex]?.imageUrl);
    prefetchImage(timelineData[prevIndex]?.imageUrl);
  }, [currentIndex, timelineData]);

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
        imageFocusX: newMemory.image_focus_x,
        imageFocusY: newMemory.image_focus_y,
        imageAspectRatio: newMemory.image_aspect_ratio,
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
    if (status !== "authenticated") {
      return;
    }

    const hasUnlock = typeof window !== "undefined" &&
      window.sessionStorage.getItem("valentine_unlocked") === "true";

    if (!hasUnlock) {
      void signOut({ redirect: false });
      router.replace("/login");
    }
  }, [status, router]);

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
