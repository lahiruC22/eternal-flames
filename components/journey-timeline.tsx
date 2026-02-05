'use client';

import { motion } from 'framer-motion';

interface JourneyTimelineProps {
  current: number;
  total: number;
}

export function JourneyTimeline({ current, total }: JourneyTimelineProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div key={index} className="relative">
          <motion.div
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'rose-gold-gradient scale-150 shadow-lg'
                : index < current
                  ? 'bg-[#e8b298]/50'
                  : 'bg-[#e8b298]/20'
            }`}
            animate={{
              scale: index === current ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          {index < total - 1 && (
            <div
              className={`absolute left-1/2 top-full h-6 w-px -translate-x-1/2 transition-colors duration-300 ${
                index < current ? 'bg-[#e8b298]/50' : 'bg-[#e8b298]/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
