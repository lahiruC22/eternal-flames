"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture, Circle } from "@react-three/drei";
import timelineData from "@/lib/timeline-data.json";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { RosePetalParticles } from "./rose-petal-particles";
import { SceneWrapper } from "./scene-wrapper";

const getImageById = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

function Scene({ currentIndex }: { currentIndex: number }) {
  const imageUrls = useMemo(
    () =>
      timelineData.map((item) => getImageById(item.imageId)?.imageUrl || ""),
    [],
  );
  const textures = useTexture(imageUrls);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.mouse.x * 0.1,
        0.05,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.mouse.y * 0.1,
        0.05,
      );
    }
  });

  const currentTexture = textures[currentIndex];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={2} />
      <pointLight position={[0, 0, 10]} intensity={40} color="#e8b298" />
      <pointLight position={[-5, 5, 5]} intensity={20} color="#fff5f5" />
      <spotLight position={[5, 5, 5]} intensity={30} color="#d4a574" angle={0.3} penumbra={1} />

      <RosePetalParticles />

      <Circle args={[2.5, 64]}>
        <meshStandardMaterial map={currentTexture} metalness={0.2} roughness={0.4} />
      </Circle>
    </group>
  );
}

export function ValentineDisplay({ currentIndex }: { currentIndex: number }) {
  return (
    <SceneWrapper 
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <Scene currentIndex={currentIndex} />
    </SceneWrapper>
  );
}
