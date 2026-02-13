"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMusic } from "@/components/music-provider";
import { FloatingHearts } from "./components/floating-hearts";
import { HeartLockUnlock } from "./components/heart-lock-unlock";
import { LoginForm } from "./components/login-form";
import {
  LoginCard,
  LoginTitle,
  LoginError,
  LoginFooter,
} from "./components/login-card";
import { LoginSubmitButton } from "./components/submit-button";

/**
 * Login Page Component
 * Features:
 * - Beautiful pink gradient background with floating hearts
 * - Heart unlock animation on successful login
 * - Passcode input with visual feedback
 * - Error handling with toast notifications
 */
export default function LoginPage() {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { armAutoplay } = useMusic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    if (!name || !passcode) {
      setErrorMessage("Please enter both your name and passcode.");
      toast({
        title: "Missing Information",
        description: "Please enter both your name and passcode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        name,
        passcode,
        redirect: false,
      });

      if (result?.error) {
        const message = "Oops! That's not the secret key to my heart. Try again, love?";
        setErrorMessage(message);
        toast({
          title: message,
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        setIsUnlocking(true);
        setErrorMessage(null);

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("valentine_unlocked", "true");
          window.sessionStorage.setItem("valentine_autoplay", "true");
        }

        void armAutoplay();

        setTimeout(() => {
          router.push("/valentine");
          router.refresh();
        }, 1500);
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans transition-colors duration-500 overflow-hidden">
      <FloatingHearts />

      <main className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        <HeartLockUnlock isUnlocking={isUnlocking} />
        <LoginTitle />

        <LoginCard>
          <LoginForm
            name={name}
            passcode={passcode}
            isLoading={isLoading}
            isUnlocking={isUnlocking}
            hasError={Boolean(errorMessage)}
            onNameChange={(value) => {
              setName(value);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            onPasscodeChange={(value) => {
              setPasscode(value);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            onSubmit={handleSubmit}
          >
            <LoginSubmitButton
              isLoading={isLoading}
              isUnlocking={isUnlocking}
            />
          </LoginForm>

          <div className="flex flex-col items-center gap-3 pt-2">
            <LoginError message={errorMessage} />
            <LoginFooter />
          </div>
        </LoginCard>

        <button
          type="button"
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
          className="mt-12 rounded-full p-2 text-primary/40 transition-colors hover:text-primary/80"
          aria-label="Toggle dark mode"
        >
          <Moon className="h-5 w-5 dark:hidden" />
          <Sun className="hidden h-5 w-5 dark:block" />
        </button>
      </main>
    </div>
  );
}
