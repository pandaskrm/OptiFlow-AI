"use client";

import {
  ContactShadows,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Group } from "three";

const LIBOT_MODEL_URL = "/models/libot/libot-premium.glb";

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

function findAnimation(
  names: string[],
  gesture: LibotGesture,
) {
  const keywords: Record<LibotGesture, string[]> = {
    idle: ["idle", "stand", "breath"],
    talk: ["talk", "speak", "explain"],
    wave: ["wave", "hello", "greet"],
    point: ["point", "show"],
    present: ["present", "showcase", "explain"],
    confirm: ["confirm", "approve", "yes", "nod"],
  };

  const normalized = names.map((name) => ({
    original: name,
    value: name.toLowerCase(),
  }));

  for (const keyword of keywords[gesture]) {
    const found = normalized.find((item) =>
      item.value.includes(keyword),
    );

    if (found) return found.original;
  }

  return names[0];
}

function LibotPremiumModel({
  state,
  speaking,
  gesture,
}: {
  state: Libot3DState;
  speaking: boolean;
  gesture: LibotGesture;
}) {
  const group = useRef<Group>(null);

  const { scene, animations } =
    useGLTF(LIBOT_MODEL_URL);

  const { actions } =
    useAnimations(animations, group);

  useEffect(() => {
    const actionNames = Object.keys(actions);

    if (actionNames.length === 0) return;

    const requestedGesture =
      speaking ? "talk" : gesture;

    const animationName =
      findAnimation(
        actionNames,
        requestedGesture,
      ) ??
      findAnimation(actionNames, "idle");

    const action =
      animationName
        ? actions[animationName]
        : undefined;

    if (!action) return;

    Object.values(actions).forEach(
      (currentAction) => {
        currentAction?.fadeOut(0.2);
      },
    );

    action
      .reset()
      .fadeIn(0.25)
      .play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, speaking, gesture]);

  const energy = stateColor(state);

  return (
    <group
      ref={group}
      position={[0, -1.45, 0]}
      scale={1.55}
    >
      <primitive object={scene} />

      <pointLight
        position={[0, 1.8, 1.8]}
        intensity={8}
        color={energy}
      />
    </group>
  );
}

function PremiumWaitingCore({
  state,
}: {
  state: Libot3DState;
}) {
  const energy = stateColor(state);

  return (
    <group position={[0, 0.2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry
          args={[0.72, 0.025, 20, 96]}
        />
        <meshStandardMaterial
          color={energy}
          emissive={energy}
          emissiveIntensity={4}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[0.18, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={energy}
          emissiveIntensity={2.5}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      <pointLight
        intensity={12}
        distance={4}
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
  const [modelAvailable, setModelAvailable] =
    useState<boolean | null>(null);

  const energy = stateColor(state);

  useEffect(() => {
    let cancelled = false;

    async function checkModel() {
      try {
        const response = await fetch(
          LIBOT_MODEL_URL,
          {
            method: "HEAD",
            cache: "no-store",
          },
        );

        if (!cancelled) {
          setModelAvailable(response.ok);
        }
      } catch {
        if (!cancelled) {
          setModelAvailable(false);
        }
      }
    }

    void checkModel();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[300px] w-full">
      <Canvas
        camera={{
          position: [0, 1.3, 5.5],
          fov: 34,
        }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={1.15} />

        <directionalLight
          position={[3, 5, 4]}
          intensity={3.2}
          color="#ffffff"
        />

        <pointLight
          position={[-2.4, 2.4, 2]}
          intensity={14}
          color="#008cff"
        />

        <pointLight
          position={[2.2, 1.5, 1.5]}
          intensity={9}
          color={energy}
        />

        {modelAvailable ? (
          <Suspense
            fallback={
              <PremiumWaitingCore
                state={state}
              />
            }
          >
            <LibotPremiumModel
              state={state}
              speaking={speaking}
              gesture={gesture}
            />
          </Suspense>
        ) : (
          <PremiumWaitingCore state={state} />
        )}

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.35}
          scale={4}
          blur={2.8}
          far={4}
        />
      </Canvas>

      {modelAvailable === false && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#49efff]">
            Libot Premium 3D
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Modèle 3D en attente
          </p>
        </div>
      )}
    </div>
  );
}