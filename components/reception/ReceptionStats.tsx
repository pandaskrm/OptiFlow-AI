"use client";

import { useEffect, useState } from "react";
import useSimulationV2 from "../../hooks/useSimulationV2";
import { RECEPTION_STATUS } from "../../constants/receptionStatus";

type ReceptionStatsProps = {
  refreshKey: number;
};

type Reception = {
  id: number;
  status: string;
};

export default function ReceptionStats({
  refreshKey,
}: ReceptionStatsProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loading, setLoading] = useState(true);

  const simulation = useSimulationV2();

  useEffect(() => {
    if (simulation.running) {
      setLoading(false);
      return;
    }

    async function loadReceptions() {
      try {
        setLoading(true);

        const response = await fetch("/api/receptions", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Impossible de charger les statistiques.");
        }

        const data = await response.json();
        setReceptions(data);
      } catch (error) {
        console.error(error);
        setReceptions([]);
      } finally {
        setLoading(false);
      }
    }

    loadReceptions();
  }, [refreshKey, simulation.running]);

  const total = simulation.running
    ? simulation.state.kpis.receptions
    : receptions.length;

  const planned = simulation.running
    ? simulation.state.receptions.planned
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.PLANNED
      ).length;

  const atDock = simulation.running
    ? simulation.state.receptions.atDock
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.AT_DOCK
      ).length;

  const finished = simulation.running
    ? simulation.state.receptions.completed
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.COMPLETED
      ).length;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">Total réceptions</p>
        <p className="mt-2 text-3xl font-bold">
          {loading ? "..." : total}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">Planifiées</p>
        <p className="mt-2 text-3xl font-bold text-blue-400">
          {loading ? "..." : planned}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">À quai</p>
        <p className="mt-2 text-3xl font-bold text-green-400">
          {loading ? "..." : atDock}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">Terminées</p>
        <p className="mt-2 text-3xl font-bold text-orange-400">
          {loading ? "..." : finished}
        </p>
      </div>
    </div>
  );
}
