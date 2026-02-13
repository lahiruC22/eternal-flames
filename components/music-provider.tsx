"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface MusicContextValue {
  isMuted: boolean;
  isReady: boolean;
  play: () => Promise<boolean>;
  armAutoplay: () => Promise<boolean>;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

function useCrossfadeMusic(
  status: "authenticated" | "unauthenticated" | "loading",
  isValentineRoute: boolean
) {
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<"a" | "b">("a");
  const isCrossfadingRef = useRef(false);
  const readyCountRef = useRef(0);
  const hasStartedRef = useRef(false);
  const autoplayArmedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReadyInternal, setIsReadyInternal] = useState(false);
  const statusRef = useRef(status);
  const readyRef = useRef(isReadyInternal);
  const baseVolume = 0.6;
  const crossfadeMs = 2000;

  useEffect(() => {
    statusRef.current = status;
    readyRef.current = isReadyInternal;
  }, [isReadyInternal, status]);

  const getActiveAudio = useCallback(() => {
    return activeRef.current === "a" ? audioARef.current : audioBRef.current;
  }, []);

  const getInactiveAudio = useCallback(() => {
    return activeRef.current === "a" ? audioBRef.current : audioARef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (audioARef.current) {
      audioARef.current.pause();
      audioARef.current.currentTime = 0;
    }
    if (audioBRef.current) {
      audioBRef.current.pause();
      audioBRef.current.currentTime = 0;
    }
  }, []);

  const handleEnded = useCallback(
    (endedKey: "a" | "b") => {
      if (activeRef.current !== endedKey) return;
      if (statusRef.current !== "authenticated") return;
      if (!readyRef.current) return;
      if (isCrossfadingRef.current) return;
      isCrossfadingRef.current = true;

      const from = getActiveAudio();
      const to = getInactiveAudio();
      if (!from || !to) {
        isCrossfadingRef.current = false;
        return;
      }

      to.currentTime = 0;
      to.volume = 0;
      void to.play();

      const steps = 20;
      const stepMs = Math.max(50, Math.floor(crossfadeMs / steps));
      let currentStep = 0;
      const fadeInterval = window.setInterval(() => {
        currentStep += 1;
        const progress = Math.min(1, currentStep / steps);
        if (from) {
          from.volume = baseVolume * (1 - progress);
        }
        if (to) {
          to.volume = baseVolume * progress;
        }
        if (progress >= 1) {
          window.clearInterval(fadeInterval);
          if (from) {
            from.pause();
            from.currentTime = 0;
            from.volume = 0;
          }
          activeRef.current = activeRef.current === "a" ? "b" : "a";
          isCrossfadingRef.current = false;
        }
      }, stepMs);
    },
    [baseVolume, crossfadeMs, getActiveAudio, getInactiveAudio]
  );

  const handleEndedA = useCallback(() => {
    handleEnded("a");
  }, [handleEnded]);

  const handleEndedB = useCallback(() => {
    handleEnded("b");
  }, [handleEnded]);

  const initAudio = useCallback(() => {
    if (audioARef.current || audioBRef.current) return;

    const audioA = new Audio("/music.mp3");
    const audioB = new Audio("/music.mp3");
    audioA.loop = false;
    audioB.loop = false;
    audioA.volume = baseVolume;
    audioB.volume = 0;
    audioARef.current = audioA;
    audioBRef.current = audioB;

    const handleCanPlay = () => {
      readyCountRef.current += 1;
      if (readyCountRef.current >= 2) {
        setIsReadyInternal(true);
      }
    };

    audioA.addEventListener("canplaythrough", handleCanPlay, { once: true });
    audioB.addEventListener("canplaythrough", handleCanPlay, { once: true });
    audioA.addEventListener("ended", handleEndedA);
    audioB.addEventListener("ended", handleEndedB);

    return () => {
      audioA.removeEventListener("canplaythrough", handleCanPlay);
      audioB.removeEventListener("canplaythrough", handleCanPlay);
      audioA.removeEventListener("ended", handleEndedA);
      audioB.removeEventListener("ended", handleEndedB);
    };
  }, [handleEndedA, handleEndedB]);

  const play = useCallback(async () => {
    if (status !== "authenticated" || !isValentineRoute || !isReadyInternal) return false;

    const audio = getActiveAudio();
    if (!audio) return false;

    try {
      await audio.play();
      hasStartedRef.current = true;
      return true;
    } catch {
      return false;
    }
  }, [getActiveAudio, isReadyInternal, isValentineRoute, status]);

  const armAutoplay = useCallback(async () => {
    autoplayArmedRef.current = true;
    initAudio();

    const audio = getActiveAudio();
    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      hasStartedRef.current = true;
      return true;
    } catch {
      return false;
    }
  }, [getActiveAudio, initAudio]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      stopAudio();
      hasStartedRef.current = false;
      return;
    }

    if (!isValentineRoute && !autoplayArmedRef.current) {
      stopAudio();
      hasStartedRef.current = false;
      return;
    }

    return initAudio();
  }, [initAudio, isValentineRoute, status, stopAudio]);

  useEffect(() => {
    if (isValentineRoute && autoplayArmedRef.current) {
      autoplayArmedRef.current = false;
    }
  }, [isValentineRoute]);

  useEffect(() => {
    if (audioARef.current) {
      audioARef.current.muted = isMuted;
    }
    if (audioBRef.current) {
      audioBRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (status !== "authenticated" || !isValentineRoute) return;
    if (!isReadyInternal) return;
    if (hasStartedRef.current) return;

    void play();
  }, [isReadyInternal, isValentineRoute, play, status]);

  useEffect(() => {
    if (status !== "authenticated" || !isValentineRoute) return;
    if (!isReadyInternal) return;
    if (hasStartedRef.current) return;

    const shouldAutoplay = typeof window !== "undefined" &&
      window.sessionStorage.getItem("valentine_autoplay") === "true";

    if (!shouldAutoplay) {
      return;
    }

    void play().then((started) => {
      if (started && typeof window !== "undefined") {
        window.sessionStorage.removeItem("valentine_autoplay");
      }
    });
  }, [isReadyInternal, isValentineRoute, play, status]);

  return {
    isMuted,
    isReady: status === "authenticated" && isValentineRoute && isReadyInternal,
    play,
    armAutoplay,
    toggleMute,
  };
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const isValentineRoute = pathname?.startsWith("/valentine") ?? false;
  const value = useCrossfadeMusic(status, isValentineRoute);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
}
