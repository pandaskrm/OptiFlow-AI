"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

type Libot3DState = "neutral" | "good" | "warning" | "critical";

type Libot3DProps = {
  state?: Libot3DState;
  speaking?: boolean;
};

function LibotPlaceholder({
  state,
  speaking,
}: {
  state: Libot3DState;
  speaking: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.position.y =
      Math.sin(t * (speaking ? 2.8 : 1.4)) * (speaking ? 0.035 : 0.018);

    group.current.rotation.y =
      Math.sin(t * (speaking ? 1.8 : 0.65)) * (speaking ? 0.08 : 0.035);
  });

  const emissive =
    state === "good"
      ? "#22c55e"
      : state === "warning"
        ? "#f59e0b"
        : state === "critical"
          ? "#ef4444"
          : "#00e5ff";

  return (
    <group ref={group} position={[0, -0.65, 0]}>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial
          color="#e8f4ff"
          metalness={0.75}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 1.5, 0.37]}>
        <boxGeometry args={[0.55, 0.22, 0.08]} />
        <meshStandardMaterial
          color="#03152d"
          emissive={emissive}
          emissiveIntensity={1.8}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.52, 0.75, 12, 24]} />
        <meshStandardMaterial
          color="#dcecff"
          metalness={0.8}
          roughness={0.23}
        />
      </mesh>

      <mesh position={[0, 0.82, 0.5]}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

export default function Libot3D({
  state = "neutral",
  speaking = false,
}: Libot3DProps) {
  return (
    <div className="h-full min-h-[260px] w-full">
      <Canvas
        camera={{
          position: [0, 1.25, 4.3],
          fov: 32,
        }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={3}
          color="#dff8ff"
        />
        <pointLight
          position={[-2, 2, 2]}
          intensity={14}
          color="#008cff"
        />
        <pointLight
          position={[2, 1, 1]}
          intensity={8}
          color="#00e5ff"
        />

        <LibotPlaceholder
          state={state}
          speaking={speaking}
        />

        <ContactShadows
          position={[0, -0.7, 0]}
          opacity={0.35}
          scale={4}
          blur={2.8}
          far={3}
        />
      </Canvas>
    </div>
  );
}
