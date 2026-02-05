"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, HeartCrack } from "lucide-react";

interface LoginCardProps {
  children: React.ReactNode;
}

/**
 * Login Card Container
 * White card with backdrop blur and shadow
 */
export function LoginCard({ children }: LoginCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full"
    >
      <div className="glass-card card-shake-offset w-full rounded-3xl p-8 shadow-2xl space-y-6">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Login Title Section
 */
export function LoginTitle() {
  return (
    <div className="text-center mb-10">
      <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-primary dark:text-rose-200 mb-2">
        Our Journey
      </h1>
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
        A Valentine&apos;s Story
      </p>
    </div>
  );
}

/**
 * Login Success Message
 */
interface LoginSuccessProps {
  isUnlocking: boolean;
}

export function LoginSuccess({ isUnlocking }: LoginSuccessProps) {
  return (
    <AnimatePresence>
      {isUnlocking && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center mt-6 text-sm text-primary italic flex items-center justify-center gap-2"
        >
          <Heart size={14} fill="#e84c6f" />
          Welcome back, love!
          <Heart size={14} fill="#e84c6f" />
        </motion.p>
      )}
    </AnimatePresence>
  );
}

interface LoginErrorProps {
  message: string | null;
}

export function LoginError({ message }: LoginErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 text-primary">
      <HeartCrack className="h-4 w-4" />
      <p className="font-serif italic text-sm tracking-tight text-primary/90">
        {message}
      </p>
      <Heart className="h-4 w-4" />
    </div>
  );
}

/**
 * Login Footer
 */
export function LoginFooter() {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-4 text-primary/30 pt-2">
        <div className="h-px w-8 bg-current" />
        <p className="text-[10px] font-medium uppercase tracking-[0.3em]">
          3rd Anniversary Tribute
        </p>
        <div className="h-px w-8 bg-current" />
      </div>
    </div>
  );
}
