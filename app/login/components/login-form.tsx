"use client";

import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  name: string;
  passcode: string;
  isLoading: boolean;
  isUnlocking: boolean;
  hasError: boolean;
  onNameChange: (value: string) => void;
  onPasscodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

/**
 * Login Form Component
 * Handles user input for name and passcode
 */
export function LoginForm({
  name,
  passcode,
  isLoading,
  isUnlocking,
  hasError,
  onNameChange,
  onPasscodeChange,
  onSubmit,
  children,
}: LoginFormProps) {
  const isDisabled = isLoading || isUnlocking;
  const passcodeClasses = hasError ? "error-glow" : "";

  return (
    <form onSubmit={onSubmit} className="space-y-6 text-left">
      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] uppercase tracking-[0.2em] text-primary/70 dark:text-primary/80 font-serif font-semibold ml-1 mb-1.5"
          >
            Your Name
          </label>
          <div className="relative">
            <Heart
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
              size={18}
              fill="currentColor"
            />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white/50 dark:bg-black/20 border-0 ring-1 ring-primary/20 focus:ring-primary/40 focus:bg-white/80 dark:focus:bg-black/40 rounded-2xl py-3.5 pl-12 pr-6 text-primary placeholder-primary/30 outline-none transition-all duration-300 font-sans"
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Passcode Input */}
        <div>
          <label
            htmlFor="passcode"
            className="block text-[11px] uppercase tracking-[0.2em] text-primary/70 dark:text-primary/80 font-serif font-semibold ml-1 mb-1.5"
          >
            Secret Passcode
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className="text-primary/60"
                  size={12}
                  fill="currentColor"
                />
              ))}
            </div>
            <Input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => onPasscodeChange(e.target.value)}
              placeholder="***"
              maxLength={16}
              className={`w-full bg-white/50 dark:bg-black/20 border-0 ring-1 ring-primary/20 focus:ring-primary/40 focus:bg-white/80 dark:focus:bg-black/40 rounded-2xl py-3.5 pl-16 pr-6 text-center text-lg tracking-[0.5em] text-primary placeholder-primary/30 outline-none transition-all duration-300 heart-input passcode-input ${passcodeClasses}`}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* Submit Button and other children */}
      {children}
    </form>
  );
}
