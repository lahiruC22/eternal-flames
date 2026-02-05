"use client";

import { Heart } from "lucide-react";

const DECORATIVE_HEARTS = [
  { top: "2.5rem", left: "10%", size: 26, opacity: 0.12 },
  { top: "25%", right: "15%", size: 36, opacity: 0.12 },
  { bottom: "5rem", left: "20%", size: 30, opacity: 0.12 },
  { bottom: "33%", right: "10%", size: 22, opacity: 0.12 },
  { bottom: "3rem", left: "50%", size: 18, opacity: 0.08 },
  { top: "18%", left: "72%", size: 20, opacity: 0.1 },
];

/**
 * Decorative Hearts Background
 * Fixed-position hearts to match the design reference
 */
export function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {DECORATIVE_HEARTS.map((heart, index) => (
        <Heart
          key={`${heart.top ?? heart.bottom}-${index}`}
          className="absolute text-primary"
          style={{
            top: heart.top,
            bottom: heart.bottom,
            left: heart.left,
            right: heart.right,
            opacity: heart.opacity,
          }}
          size={heart.size}
          fill="currentColor"
        />
      ))}
    </div>
  );
}
