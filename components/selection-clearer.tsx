"use client";

import type { MouseEvent, ReactNode } from "react";

interface SelectionClearerProps {
  children: ReactNode;
}

export function SelectionClearer({ children }: SelectionClearerProps) {
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, [contenteditable='true']")) {
      return;
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      selection.removeAllRanges();
    }
  };

  return <div onMouseDown={handleMouseDown}>{children}</div>;
}
