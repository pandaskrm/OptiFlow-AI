"use client";

import Image from "next/image";

type LibotState = "neutral" | "good" | "warning" | "critical";

type LibotAvatarProps = {
  state: LibotState;
};

const stateConfig = {
  neutral: {
    label: "Libot",
    image: "/organia-reference/organia-ai-brain-transparent.png",
    glow: "drop-shadow-[0_0_22px_rgba(0,229,255,0.55)]",
    badge: "border-[#00e5ff]/50 bg-[#006bff]/10 text-[#49efff]",
  },
  good: {
    label: "Libot Nexus",
    image: "/organia-reference/organia-ai-brain-transparent.png",
    glow: "drop-shadow-[0_0_24px_rgba(52,211,153,0.6)]",
    badge: "border-emerald-400/60 bg-emerald-500/10 text-emerald-300",
  },
  warning: {
    label: "Libot Quantum",
    image: "/organia-reference/organia-ai-brain-transparent.png",
    glow: "drop-shadow-[0_0_24px_rgba(251,146,60,0.6)]",
    badge: "border-orange-400/60 bg-orange-500/10 text-orange-300",
  },
  critical: {
    label: "Libot Pulse",
    image: "/organia-reference/organia-ai-brain-transparent.png",
    glow: "drop-shadow-[0_0_28px_rgba(248,113,113,0.7)]",
    badge: "border-red-400/70 bg-red-500/10 text-red-300",
  },
} as const;

export default function LibotAvatar({ state }: LibotAvatarProps) {
  const config = stateConfig[state];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className={`relative h-28 w-40 sm:h-32 sm:w-48 ${config.glow}`}>
        <Image
          src={config.image}
          alt={config.label}
          fill
          sizes="220px"
          className="object-contain mix-blend-screen"
        />
      </div>

      <span
        className={`mt-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${config.badge}`}
      >
        {config.label}
      </span>
    </div>
  );
}
