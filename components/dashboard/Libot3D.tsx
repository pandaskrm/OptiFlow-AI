"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

type Libot3DState =
  | "neutral"
  | "good"
  | "warning"
  | "critical";

type LibotGesture =
  | "idle"
  | "talk"
  | "wave"
  | "point"
  | "present"
  | "confirm";

type Libot3DProps = {
  state?: Libot3DState;
  speaking?: boolean;
  gesture?: LibotGesture;
};

function stateColor(state: Libot3DState) {
  if (state === "good") return "#39ff72";
  if (state === "warning") return "#ff9d00";
  if (state === "critical") return "#ff334d";
  return "#00e5ff";
}

function LibotCore({
  state,
  speaking,
  gesture,
}: {
  state: Libot3DState;
  speaking: boolean;
  gesture: LibotGesture;
}) {
  const root = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const ringC = useRef<Mesh>(null);
  const orbitA = useRef<Group>(null);
  const orbitB = useRef<Group>(null);

  const energy = stateColor(state);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const activity =
      speaking || gesture === "talk"
        ? 1.35
        : gesture === "confirm"
          ? 1.18
          : gesture === "present" ||
              gesture === "point"
            ? 1.1
            : 1;

    if (root.current) {
      root.current.position.y =
        Math.sin(t * 1.25) * 0.055;

      root.current.rotation.y =
        Math.sin(t * 0.35) * 0.08;
    }

    if (inner.current) {
      const pulse =
        1 +
        Math.sin(t * (speaking ? 5.5 : 2.2)) *
          (speaking ? 0.075 : 0.035);

      inner.current.scale.setScalar(
        pulse * activity,
      );
    }

    if (ringA.current) {
      ringA.current.rotation.x =
        t * 0.42 * activity;
      ringA.current.rotation.y =
        t * 0.28 * activity;
    }

    if (ringB.current) {
      ringB.current.rotation.y =
        -t * 0.34 * activity;
      ringB.current.rotation.z =
        t * 0.24 * activity;
    }

    if (ringC.current) {
      ringC.current.rotation.x =
        -t * 0.22 * activity;
      ringC.current.rotation.z =
        -t * 0.38 * activity;
    }

    if (orbitA.current) {
      orbitA.current.rotation.z =
        t * 0.72 * activity;
    }

    if (orbitB.current) {
      orbitB.current.rotation.y =
        -t * 0.55 * activity;
      orbitB.current.rotation.x =
        t * 0.18;
    }
  });

  return (
    <group ref={root}>
      {/* halo arrière */}
      <mesh position={[0, 0, -0.65]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial
          color={energy}
          transparent
          opacity={0.035}
        />
      </mesh>

      <mesh position={[0, 0, -0.58]}>
        <ringGeometry args={[1.08, 1.12, 96]} />
        <meshBasicMaterial
          color={energy}
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh position={[0, 0, -0.55]}>
        <ringGeometry args={[1.32, 1.335, 96]} />
        <meshBasicMaterial
          color="#008cff"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* sphère extérieure */}
      <mesh>
        <icosahedronGeometry args={[0.78, 4]} />
        <meshPhysicalMaterial
          color="#06192b"
          emissive={energy}
          emissiveIntensity={0.32}
          transparent
          opacity={0.19}
          metalness={0.7}
          roughness={0.08}
          transmission={0.18}
          thickness={0.4}
        />
      </mesh>

      {/* réseau interne */}
      <mesh>
        <icosahedronGeometry args={[0.67, 2]} />
        <meshBasicMaterial
          color={energy}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* cerveau / noyau */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.34, 5]} />
        <meshStandardMaterial
          color="#e9fbff"
          emissive={energy}
          emissiveIntensity={
            speaking ? 5.5 : 3.5
          }
          metalness={0.72}
          roughness={0.08}
        />
      </mesh>

      {/* coeur central */}
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* anneaux tridimensionnels */}
      <mesh ref={ringA} rotation={[1.05, 0.2, 0]}>
        <torusGeometry
          args={[0.92, 0.014, 12, 128]}
        />
        <meshStandardMaterial
          color={energy}
          emissive={energy}
          emissiveIntensity={4}
          transparent
          opacity={0.78}
        />
      </mesh>

      <mesh ref={ringB} rotation={[0.3, 1.1, 0.5]}>
        <torusGeometry
          args={[1.06, 0.011, 12, 128]}
        />
        <meshStandardMaterial
          color="#008cff"
          emissive="#008cff"
          emissiveIntensity={4}
          transparent
          opacity={0.58}
        />
      </mesh>

      <mesh ref={ringC} rotation={[0.8, -0.4, 1.1]}>
        <torusGeometry
          args={[1.2, 0.008, 12, 128]}
        />
        <meshStandardMaterial
          color={energy}
          emissive={energy}
          emissiveIntensity={3}
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* satellites */}
      <group ref={orbitA}>
        <mesh position={[0.98, 0, 0]}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={energy}
            emissiveIntensity={7}
          />
        </mesh>
      </group>

      <group
        ref={orbitB}
        rotation={[0.7, 0, 0.5]}
      >
        <mesh position={[0, 1.16, 0]}>
          <sphereGeometry args={[0.04, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#008cff"
            emissiveIntensity={7}
          />
        </mesh>
      </group>

      {/* énergie verticale */}
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshBasicMaterial color={energy} />
      </mesh>

      <mesh position={[0, -1.38, 0]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshBasicMaterial color={energy} />
      </mesh>

      {/* illumination */}
      <pointLight
        position={[0, 0, 1.2]}
        intensity={speaking ? 18 : 11}
        distance={5}
        color={energy}
      />

      <pointLight
        position={[0, 0, -0.5]}
        intensity={8}
        distance={4}
        color="#008cff"
      />
    </group>
  );
}

export default function Libot3D({
  state = "neutral",
  speaking = false,
  gesture = "idle",
}: Libot3DProps) {
  const energy = stateColor(state);

  return (
    <div className="relative h-full min-h-[300px] w-full overflow-hidden">
      {/* glow DOM pour donner de la profondeur */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: energy,
          opacity: speaking ? 0.2 : 0.11,
        }}
      />

      <Canvas
        camera={{
          position: [0, 0, 4.4],
          fov: 36,
        }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={0.55} />

        <directionalLight
          position={[3, 4, 4]}
          intensity={2.2}
          color="#ffffff"
        />

        <LibotCore
          state={state}
          speaking={speaking}
          gesture={gesture}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00e5ff]/20 bg-[#010914]/60 px-3 py-1 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: energy,
              boxShadow: `0 0 10px ${energy}`,
            }}
          />

          <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#8cf6ff]">
            {speaking
              ? "Libot communique"
              : "Libot Intelligence Core"}
          </span>
        </div>
      </div>
    </div>
  );
}
