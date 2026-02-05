"use client";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  isUnlocking: boolean;
  disabled?: boolean;
}

/**
 * Login Submit Button
 * Shows different states: idle, loading, unlocking
 */
export function LoginSubmitButton({
  isLoading,
  isUnlocking,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading || isUnlocking}
      className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 active:scale-[0.98]"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isUnlocking ? "Unlocking..." : isLoading ? "Opening..." : "Open Our Story"}
        <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
      </span>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </Button>
  );
}
