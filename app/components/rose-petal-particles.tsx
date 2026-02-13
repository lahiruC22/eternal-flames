'use client';

import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';

// Realistic rose petal colors - deep reds, pinks, and crimsons
const petalColors = ['#c2185b', '#e91e63', '#d81b60', '#ad1457', '#f06292', '#ec407a'];

// Generate random values outside component for React 19 purity compliance
const generatePetalData = () => ({
  speed: Math.random() * 0.02 + 0.01,
  rotationSpeed: new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
  ),
  flutterSpeed: Math.random() * 0.01,
  initialY: 10 + Math.random() * 5,
  color: petalColors[Math.floor(Math.random() * petalColors.length)],
  initialPosition: {
    x: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 10,
  },
  initialRotation: {
    x: Math.random() * Math.PI,
    y: Math.random() * Math.PI,
    z: Math.random() * Math.PI,
  },
  scale: Math.random() * 0.2 + 0.1,
});

function RosePetal() {
  const ref = useRef<THREE.Object3D>(null!);
  const isActiveRef = useRef(true);

  const petalData = useMemo(() => generatePetalData(), []);

  // Set initial state once the ref is available
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(
        petalData.initialPosition.x,
        petalData.initialY,
        petalData.initialPosition.z,
      );
      ref.current.rotation.set(
        petalData.initialRotation.x,
        petalData.initialRotation.y,
        petalData.initialRotation.z,
      );
      ref.current.scale.set(petalData.scale, petalData.scale, petalData.scale);
    }
  }, [petalData]);

  useEffect(() => {
    const handleVisibility = () => {
      isActiveRef.current = document.visibilityState === "visible";
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useFrame((state) => {
    if (!isActiveRef.current) {
      return;
    }
    if (ref.current) {
      ref.current.position.y -= petalData.speed;
      ref.current.position.x +=
        Math.sin(state.clock.elapsedTime * 0.5 + ref.current.position.y * 10) *
        petalData.flutterSpeed;

      ref.current.rotation.x += petalData.rotationSpeed.x;
      ref.current.rotation.y += petalData.rotationSpeed.y;
      ref.current.rotation.z += petalData.rotationSpeed.z;

      if (ref.current.position.y < -10) {
        ref.current.position.y = petalData.initialY;
        ref.current.position.x = (Math.random() - 0.5) * 20;
      }
    }
  });

  return <Instance ref={ref} color={petalData.color} />;
}

export function RosePetalParticles() {
  const petalCount = useMemo(() => {
    if (typeof window === 'undefined') return 60;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const cpuCores = navigator.hardwareConcurrency || 4;

    if (prefersReducedMotion) return 20;
    if (isMobile || cpuCores <= 4) return 40;
    return 80;
  }, []);

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Realistic rose petal shape - organic, curved with a pointed tip
    shape.moveTo(0, 0);
    
    // Left side of petal - curved outward
    shape.bezierCurveTo(-0.15, 0.1, -0.25, 0.3, -0.2, 0.5);
    
    // Top of petal - rounded edge
    shape.bezierCurveTo(-0.1, 0.65, 0.1, 0.65, 0.2, 0.5);
    
    // Right side of petal - curved inward
    shape.bezierCurveTo(0.25, 0.3, 0.15, 0.1, 0, 0);
    
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <Instances geometry={petalShape} range={petalCount}>
      <meshStandardMaterial toneMapped={false} side={THREE.DoubleSide} />
      {Array.from({ length: petalCount }).map((_, i) => (
        <RosePetal key={i} />
      ))}
    </Instances>
  );
}
