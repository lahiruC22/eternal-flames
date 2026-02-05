"use client";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
}

interface TimelineNavigationProps {
  memories: Memory[];
  currentIndex: number;
  onSelectMemory: (index: number) => void;
}

export function TimelineNavigation({ 
  memories, 
  currentIndex, 
  onSelectMemory 
}: TimelineNavigationProps) {
  return (
    <div className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 md:left-12 md:block">
      <div className="flex flex-col gap-4">
        {memories.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectMemory(index)}
            className="group relative"
          >
            <span
              className={`text-sm transition-all duration-300 ${
                index === currentIndex
                  ? "font-bold text-primary"
                  : "text-foreground/30 hover:text-foreground/60"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < memories.length - 1 && (
              <div className="absolute left-1/2 top-full h-8 w-px -translate-x-1/2 bg-foreground/10" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
