"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceDetector } from "@mediapipe/tasks-vision";

export interface FocusPoint {
  x: number;
  y: number;
}

interface UseImageFocusOptions {
  imageUrl: string;
  existingFocus: FocusPoint | null;
  memoryId?: string;
  enabled?: boolean;
}

const focusCache = new Map<string, FocusPoint>();
const pendingCache = new Map<string, Promise<FocusPoint | null>>();
const persistedMemoryIds = new Set<string>();

const WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_PATH = "/models/face_detector.tflite";

let detectorPromise: Promise<FaceDetector> | null = null;

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

async function getDetector(): Promise<FaceDetector> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const resolver = await vision.FilesetResolver.forVisionTasks(WASM_PATH);
      return vision.FaceDetector.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
        },
        runningMode: "IMAGE",
      });
    })();
  }

  return detectorPromise;
}

async function loadDetectionImage(imageUrl: string): Promise<HTMLImageElement | null> {
  if (!imageUrl) {
    return null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

async function detectOnImage(image: HTMLImageElement): Promise<FocusPoint | null> {
  if (!image.naturalWidth || !image.naturalHeight) {
    return null;
  }

  try {
    const detector = await getDetector();
    const result = detector.detect(image);

    if (!result.detections.length) {
      return null;
    }

    let bestBox: { originX: number; originY: number; width: number; height: number } | null = null;
    let bestArea = 0;

    for (const detection of result.detections) {
      const box = detection.boundingBox;
      if (!box) {
        continue;
      }

      const area = box.width * box.height;
      if (area > bestArea) {
        bestArea = area;
        bestBox = box;
      }
    }

    if (!bestBox) {
      return null;
    }

    const centerX = bestBox.originX + bestBox.width / 2;
    const centerY = bestBox.originY + bestBox.height / 2;

    return {
      x: clamp(centerX / image.naturalWidth),
      y: clamp(centerY / image.naturalHeight),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("MediaPipe face detection failed", error);
    }
    return null;
  }
}

async function detectFocus(
  image: HTMLImageElement,
  imageUrl: string
): Promise<FocusPoint | null> {
  const primary = await detectOnImage(image);
  if (primary) {
    return primary;
  }

  const fallbackImage = await loadDetectionImage(imageUrl);
  if (!fallbackImage) {
    return null;
  }

  return detectOnImage(fallbackImage);
}

async function persistFocus(memoryId: string, focus: FocusPoint): Promise<void> {
  if (persistedMemoryIds.has(memoryId)) {
    return;
  }

  persistedMemoryIds.add(memoryId);

  try {
    const response = await fetch(`/api/memories/${memoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        imageFocusX: focus.x,
        imageFocusY: focus.y,
      }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== "production") {
        const message = await response.text();
        console.warn("Failed to persist image focus", {
          status: response.status,
          message,
        });
      }
      persistedMemoryIds.delete(memoryId);
    }
  } catch {
    persistedMemoryIds.delete(memoryId);
  }
}

function handleCachedFocus(
  cached: FocusPoint,
  memoryId: string | undefined,
  setDetectedFocus: (focus: FocusPoint) => void,
  hasResolvedRef: React.MutableRefObject<boolean>
): void {
  Promise.resolve().then(() => setDetectedFocus(cached));
  hasResolvedRef.current = true;
  if (memoryId) {
    void persistFocus(memoryId, cached);
  }
}

interface DetectionResultContext {
  result: FocusPoint | null;
  isCancelled: boolean;
  imageUrl: string;
  memoryId?: string;
  setDetectedFocus: (focus: FocusPoint) => void;
  hasResolvedRef: React.MutableRefObject<boolean>;
}

function handleDetectionResult({
  result,
  isCancelled,
  imageUrl,
  memoryId,
  setDetectedFocus,
  hasResolvedRef,
}: DetectionResultContext): void {
  if (isCancelled || !result) {
    return;
  }
  focusCache.set(imageUrl, result);
  setDetectedFocus(result);
  hasResolvedRef.current = true;
  if (memoryId) {
    void persistFocus(memoryId, result);
  }
}

function useFocusDetection(
  imageUrl: string,
  imageElement: HTMLImageElement | null,
  enabled: boolean,
  memoryId?: string
): FocusPoint | null {
  const [detectedFocus, setDetectedFocus] = useState<FocusPoint | null>(() => {
    return focusCache.get(imageUrl) ?? null;
  });
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    hasResolvedRef.current = false;
    const cached = focusCache.get(imageUrl) ?? null;
    Promise.resolve().then(() => setDetectedFocus(cached));
  }, [imageUrl]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!imageUrl || !imageElement) {
      return;
    }

    if (hasResolvedRef.current) {
      return;
    }

    const cached = focusCache.get(imageUrl);
    if (cached) {
      handleCachedFocus(cached, memoryId, setDetectedFocus, hasResolvedRef);
      return;
    }

    let pending = pendingCache.get(imageUrl);
    if (!pending) {
      pending = detectFocus(imageElement, imageUrl);
      pendingCache.set(imageUrl, pending);
    }

    let isCancelled = false;

    pending
      .then((result) => {
        handleDetectionResult({
          result,
          isCancelled,
          imageUrl,
          memoryId,
          setDetectedFocus,
          hasResolvedRef,
        });
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
    };
  }, [enabled, imageElement, imageUrl, memoryId]);

  return detectedFocus;
}

export function useImageFocus({
  imageUrl,
  existingFocus,
  memoryId,
  enabled = true,
}: UseImageFocusOptions) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const detectedFocus = useFocusDetection(imageUrl, imageElement, enabled, memoryId);
  const focus = existingFocus ?? detectedFocus;

  const registerImage = useCallback((img: HTMLImageElement) => {
    setImageElement(img);
  }, []);

  return {
    focus,
    registerImage,
  };
}
