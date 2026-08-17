"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

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

function LibotRobot({
  state,
  speaking,
  gesture,
}: {
  state: Libot3DState;
  speaking: boolean;
  gesture: LibotGesture;
}) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);

  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);

  const leftForearm = useRef<Group>(null);
  const rightForearm = useRef<Group>(null);

  const energy = stateColor(state);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (root.current) {
      root.current.position.y =
        -1.35 +
        Math.sin(t * (speaking ? 2.3 : 1.25)) *
          (speaking ? 0.025 : 0.012);

      root.current.rotation.y =
        Math.sin(t * 0.45) * 0.025;
    }

    if (head.current) {
      head.current.rotation.y =
        Math.sin(t * 0.7) * 0.045;

      head.current.rotation.x =
        Math.sin(t * 0.5) * 0.018;
    }

    if (
      !leftArm.current ||
      !rightArm.current ||
      !leftForearm.current ||
      !rightForearm.current
    ) {
      return;
    }

    leftArm.current.rotation.set(0, 0, 0.08);
    rightArm.current.rotation.set(0, 0, -0.08);

    leftForearm.current.rotation.set(0, 0, 0);
    rightForearm.current.rotation.set(0, 0, 0);

    if (speaking || gesture === "talk") {
      rightArm.current.rotation.z =
        -0.38 + Math.sin(t * 3.2) * 0.12;

      rightForearm.current.rotation.z =
        -0.72 + Math.sin(t * 3.6) * 0.2;

      leftArm.current.rotation.z =
        0.25 + Math.sin(t * 2.4) * 0.08;

      leftForearm.current.rotation.z =
        0.45 + Math.sin(t * 2.7) * 0.12;
    } else if (gesture === "wave") {
      rightArm.current.rotation.z = -1.25;
      rightArm.current.rotation.x = -0.15;

      rightForearm.current.rotation.z =
        -0.45 + Math.sin(t * 5.5) * 0.28;
    } else if (gesture === "point") {
      rightArm.current.rotation.z = -0.72;
      rightArm.current.rotation.x = -0.28;
      rightForearm.current.rotation.z = -0.62;
    } else if (gesture === "present") {
      leftArm.current.rotation.z = 0.62;
      leftArm.current.rotation.x = -0.18;
      leftForearm.current.rotation.z = 0.55;

      rightArm.current.rotation.z = -0.28;
      rightForearm.current.rotation.z = -0.38;
    } else if (gesture === "confirm") {
      rightArm.current.rotation.z = -0.82;
      rightForearm.current.rotation.z = -1.0;
    }
  });

  return (
    <group
      ref={root}
      position={[0, -1.35, 0]}
      scale={1.08}
    >
      {/* Tête */}
      <group ref={head} position={[0, 2.55, 0]}>
        <mesh>
          <sphereGeometry args={[0.46, 48, 48]} />
          <meshStandardMaterial
            color="#eaf4ff"
            metalness={0.72}
            roughness={0.18}
          />
        </mesh>

        {/* Visage OLED */}
        <mesh
          position={[0, -0.015, 0.405]}
          scale={[1.18, 0.78, 0.16]}
        >
          <sphereGeometry args={[0.34, 48, 48]} />
          <meshStandardMaterial
            color="#01050b"
            metalness={0.55}
            roughness={0.12}
          />
        </mesh>

        {/* Yeux */}
        <mesh position={[-0.15, 0.04, 0.715]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial
            color={energy}
            emissive={energy}
            emissiveIntensity={5}
          />
        </mesh>

        <mesh position={[0.15, 0.04, 0.715]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial
            color={energy}
            emissive={energy}
            emissiveIntensity={5}
          />
        </mesh>

        {/* Sourire */}
        <mesh
          position={[0, -0.13, 0.714]}
          rotation={[0, 0, Math.PI]}
        >
          <torusGeometry
            args={[0.11, 0.018, 12, 32, Math.PI]}
          />
          <meshStandardMaterial
            color={energy}
            emissive={energy}
            emissiveIntensity={4.5}
          />
        </mesh>

        {/* Oreilles tech */}
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.46, 0, 0]}
          >
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry
                args={[0.16, 0.16, 0.11, 32]}
              />
              <meshStandardMaterial
                color="#172033"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            <mesh
              position={[side * 0.06, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <torusGeometry
                args={[0.09, 0.018, 12, 32]}
              />
              <meshStandardMaterial
                color={energy}
                emissive={energy}
                emissiveIntensity={3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cou */}
      <mesh position={[0, 2.08, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 0.24, 24]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.9}
          roughness={0.16}
        />
      </mesh>

      {/* Torse */}
      <mesh position={[0, 1.47, 0]}>
        <capsuleGeometry args={[0.52, 0.62, 12, 28]} />
        <meshStandardMaterial
          color="#e6f0fb"
          metalness={0.78}
          roughness={0.2}
        />
      </mesh>

      {/* Plaque poitrine */}
      <mesh position={[0, 1.53, 0.52]}>
        <circleGeometry args={[0.17, 40]} />
        <meshStandardMaterial
          color="#06111f"
          metalness={0.65}
          roughness={0.18}
        />
      </mesh>

      <mesh position={[0, 1.53, 0.535]}>
        <torusGeometry args={[0.115, 0.022, 16, 40]} />
        <meshStandardMaterial
          color={energy}
          emissive={energy}
          emissiveIntensity={4}
        />
      </mesh>

      {/* Taille */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.31, 0.36, 0.24, 24]} />
        <meshStandardMaterial
          color="#0b1220"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Bras gauche */}
      <group
        ref={leftArm}
        position={[-0.63, 1.72, 0]}
      >
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#e7f0fa"
            metalness={0.75}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.36, 0]}>
          <capsuleGeometry args={[0.13, 0.42, 8, 18]} />
          <meshStandardMaterial
            color="#dae7f5"
            metalness={0.76}
            roughness={0.22}
          />
        </mesh>

        <group
          ref={leftForearm}
          position={[0, -0.72, 0]}
        >
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry
              args={[0.12, 0.34, 8, 18]}
            />
            <meshStandardMaterial
              color="#dce9f7"
              metalness={0.76}
              roughness={0.22}
            />
          </mesh>

          <mesh position={[0, -0.51, 0]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Bras droit */}
      <group
        ref={rightArm}
        position={[0.63, 1.72, 0]}
      >
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#e7f0fa"
            metalness={0.75}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.36, 0]}>
          <capsuleGeometry args={[0.13, 0.42, 8, 18]} />
          <meshStandardMaterial
            color="#dae7f5"
            metalness={0.76}
            roughness={0.22}
          />
        </mesh>

        <group
          ref={rightForearm}
          position={[0, -0.72, 0]}
        >
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry
              args={[0.12, 0.34, 8, 18]}
            />
            <meshStandardMaterial
              color="#dce9f7"
              metalness={0.76}
              roughness={0.22}
            />
          </mesh>

          <mesh position={[0, -0.51, 0]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Bassin */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#dfeaf6"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Jambes */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.23, 0.05, 0]}>
            <capsuleGeometry
              args={[0.16, 0.55, 10, 22]}
            />
            <meshStandardMaterial
              color="#dce8f4"
              metalness={0.78}
              roughness={0.22}
            />
          </mesh>

          <mesh position={[side * 0.23, -0.39, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial
              color="#101827"
              metalness={0.9}
              roughness={0.18}
            />
          </mesh>

          <mesh position={[side * 0.23, -0.79, 0]}>
            <capsuleGeometry
              args={[0.15, 0.46, 10, 22]}
            />
            <meshStandardMaterial
              color="#e1ebf6"
              metalness={0.78}
              roughness={0.22}
            />
          </mesh>

          <mesh
            position={[side * 0.23, -1.15, 0.08]}
            scale={[1.18, 0.55, 1.55]}
          >
            <sphereGeometry args={[0.19, 28, 28]} />
            <meshStandardMaterial
              color="#e7f0fa"
              metalness={0.76}
              roughness={0.2}
            />
          </mesh>

          <mesh
            position={[side * 0.23, -1.23, 0.22]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry
              args={[0.12, 0.025, 12, 32]}
            />
            <meshStandardMaterial
              color={energy}
              emissive={energy}
              emissiveIntensity={4}
            />
          </mesh>
        </group>
      ))}

      <pointLight
        position={[0, 2.2, 1.8]}
        intensity={8}
        color={energy}
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
    <div className="relative h-full min-h-[300px] w-full">
      <Canvas
        camera={{
          position: [0, 1.25, 5.2],
          fov: 34,
        }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={1.25} />

        <directionalLight
          position={[3, 5, 4]}
          intensity={3.4}
          color="#ffffff"
        />

        <pointLight
          position={[-2.4, 2.4, 2]}
          intensity={12}
          color="#008cff"
        />

        <pointLight
          position={[2.2, 1.5, 1.5]}
          intensity={8}
          color={energy}
        />

        <LibotRobot
          state={state}
          speaking={speaking}
          gesture={gesture}
        />

        <ContactShadows
          position={[0, -2.58, 0]}
          opacity={0.42}
          scale={4}
          blur={2.6}
          far={4}
        />
      </Canvas>
    </div>
  );
}
