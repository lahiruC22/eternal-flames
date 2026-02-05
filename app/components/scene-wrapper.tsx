'use client';

import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

interface SceneWrapperProps {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  className?: string;
}

export function SceneWrapper({ 
  children, 
  camera = { position: [0, 0, 10], fov: 50 },
  className = "absolute inset-0 z-0"
}: SceneWrapperProps) {
  return (
    <div className={className}>
      <Canvas camera={camera}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
