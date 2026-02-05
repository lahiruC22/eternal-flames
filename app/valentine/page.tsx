"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import timelineDataJson from "@/lib/timeline-data.json";
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
  
  const [timelineData, setTimelineData] = useState<Memory[]>(timelineDataJson as Memory[]);
  const isHydratedRef = useRef(false);
  const currentIndex = Number(searchParams.get('memory')) || 0;
  const isArchiveOpen = searchParams.get('archive') === 'true';
  
  const [isMuted, setIsMuted] = useState(false);
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

  useEffect(() => {
    const savedData = localStorage.getItem('timelineData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        startTransition(() => {
          setTimelineData(parsed);
        });
      } catch (e) {
        console.error('Failed to parse saved timeline data:', e);
      }
    }
    isHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (isHydratedRef.current) {
      try {
        localStorage.setItem('timelineData', JSON.stringify(timelineData));
      } catch (e) {
        console.error('Failed to save timeline data:', e);
      }
    }
  }, [timelineData]);

  const currentMemory = timelineData[currentIndex];

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

  const handleAddMemory = (memory: {
    title: string;
    date: string;
    caption: string;
    imageUrl: string;
  }) => {
    const newMemory: Memory = {
      id: crypto.randomUUID(),
      title: memory.title,
      date: memory.date,
      caption: memory.caption,
      description: memory.caption,
      imageUrl: memory.imageUrl, // ✅ Correct field for custom images
    };

    const updatedData = [...timelineData, newMemory];
    setTimelineData(updatedData);
  };

  if (!currentMemory) {
    return null;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
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

      <ValentineFooter
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

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
