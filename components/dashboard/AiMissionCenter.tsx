"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  AiMission,
  AiMissionPriority,
} from "../../lib/ai/missionEngine";

type AiMissionCenterProps = {
  missions: AiMission[];
};

const PRIORITY_LABEL: Record<
  AiMissionPriority,
  string
> = {
  CRITICAL: "Critique",
  HIGH: "Élevée",
  MEDIUM: "Moyenne",
  LOW: "Faible",
};

const PRIORITY_CLASS: Record<
  AiMissionPriority,
  string
> = {
  CRITICAL:
    "border-red-500/50 bg-red-500/10 text-red-300",
  HIGH:
    "border-orange-500/50 bg-orange-500/10 text-orange-300",
  MEDIUM:
    "border-amber-500/50 bg-amber-500/10 text-amber-300",
  LOW:
    "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
};

export default function AiMissionCenter({
  missions,
}: AiMissionCenterProps) {
  const [completedIds, setCompletedIds] =
    useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(
        "optiflow-completed-missions",
      );

      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch {
      setCompletedIds([]);
    }
  }, []);

  const visibleMissions = useMemo(
    () =>
      missions.filter(
        (mission) =>
          !completedIds.includes(mission.id),
      ),
    [missions, completedIds],
  );

  function completeMission(id: string) {
    const next = [...new Set([...completedIds, id])];

    setCompletedIds(next);

    sessionStorage.setItem(
      "optiflow-completed-missions",
      JSON.stringify(next),
    );
  }

  function resetMissions() {
    setCompletedIds([]);
    sessionStorage.removeItem(
      "optiflow-completed-missions",
    );
  }

  if (missions.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 rounded-2xl border border-cyan-900/70 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Centre de missions IA
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Priorités opérationnelles
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Actions recommandées à partir des données de
            l’entrepôt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
            {visibleMissions.length} mission(s)
          </span>

          {completedIds.length > 0 && (
            <button
              type="button"
              onClick={resetMissions}
              className="text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {visibleMissions.length === 0 ? (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-200">
          Toutes les missions ont été traitées.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {visibleMissions.map((mission, index) => (
            <article
              key={mission.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mission {index + 1} · {mission.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-white">
                    {mission.title}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${PRIORITY_CLASS[mission.priority]}`}
                >
                  {PRIORITY_LABEL[mission.priority]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {mission.explanation}
              </p>

              <div className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
                <div>
                  <p className="font-bold text-orange-300">
                    Impact
                  </p>
                  <p className="mt-1 text-slate-400">
                    {mission.impact}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-cyan-300">
                    Action recommandée
                  </p>
                  <p className="mt-1 text-slate-300">
                    {mission.recommendedAction}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-emerald-300">
                    Gain attendu
                  </p>
                  <p className="mt-1 text-slate-400">
                    {mission.estimatedGain}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  completeMission(mission.id)
                }
                className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400"
              >
                Marquer comme traitée
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
