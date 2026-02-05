'use client';

import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';

// Rose-gold petal colors matching the theme
const petalColors = ['#e8b298', '#d4a574', '#f5c9b0', '#e0a682', '#c99165'];

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

  useFrame((state) => {
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
  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    // A more petal-like shape
    shape.moveTo(0.25, -0.25);
    shape.quadraticCurveTo(0, -0.5, -0.25, -0.25);
    shape.quadraticCurveTo(-0.5, 0, 0, 0.5);
    shape.quadraticCurveTo(0.5, 0, 0.25, -0.25);
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <Instances geometry={petalShape} range={100}>
      <meshStandardMaterial toneMapped={false} side={THREE.DoubleSide} />
      {Array.from({ length: 100 }).map((_, i) => (
        <RosePetal key={i} />
      ))}
    </Instances>
  );
}
