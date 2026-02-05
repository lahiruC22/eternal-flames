"use client";

import { motion } from "framer-motion";

interface HeartLockUnlockProps {
  isUnlocking: boolean;
}

/**
 * Rose gold heart icon with glow, matched to the reference design.
 */
export function HeartLockUnlock({ isUnlocking }: HeartLockUnlockProps) {
  return (
    <div className="mb-8 relative group cursor-pointer">
      <div className="absolute inset-0 rounded-full bg-primary blur-3xl opacity-20 transition-transform duration-700 group-hover:scale-110 dark:opacity-40" />
      <motion.div
        className="relative w-24 h-24 flex items-center justify-center"
        animate={
          isUnlocking
            ? { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }
            : { scale: 1 }
        }
        transition={{ duration: 0.8 }}
      >
        <svg className="h-full w-full drop-shadow-2xl" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4c2c2" />
              <stop offset="50%" stopColor="#b76e79" />
              <stop offset="100%" stopColor="#8e5a63" />
            </linearGradient>
          </defs>
          <path
            d="M50 88.9L42.8 82.3C17.1 58.9 0 43.4 0 24.5C0 10.8 10.8 0 24.5 0C32.2 0 39.6 3.6 44.4 9.2L50 15.7L55.6 9.2C60.4 3.6 67.8 0 75.5 0C89.2 0 100 10.8 100 24.5C100 43.4 82.9 58.9 57.2 82.4L50 88.9Z"
            fill="url(#roseGoldGrad)"
          />
          <path
            d="M50 75L45 70C28 55 15 45 15 32C15 22 22 15 32 15C38 15 44 18 47 23L50 26L53 23C56 18 62 15 68 15C78 15 85 22 85 32C85 45 72 55 55 70L50 75Z"
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
        <div className="absolute h-6 w-2 rounded-full bg-white/30 blur-[1px]" />
      </motion.div>
    </div>
  );
}
