"use client";

import { useEffect, useState } from "react";
import useDemo from "../../hooks/useDemo";
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
  const demo = useDemo();

  useEffect(() => {
    if (demo.running) {
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
  }, [refreshKey, demo.running]);

  const total = demo.running
    ? demo.state.completedToday + demo.state.activeReceptions
    : receptions.length;

  const planned = demo.running
    ? Math.max(
        0,
        demo.state.activeReceptions - demo.state.occupiedDocks
      )
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.PLANNED
      ).length;

  const atDock = demo.running
    ? demo.state.occupiedDocks
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.AT_DOCK
      ).length;

  const finished = demo.running
    ? demo.state.completedToday
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.COMPLETED
      ).length;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">
          Total réceptions
        </p>

        <p className="mt-2 text-3xl font-bold">
          {loading ? "..." : total}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">
          Planifiées
        </p>

        <p className="mt-2 text-3xl font-bold text-blue-400">
          {loading ? "..." : planned}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">
          À quai
        </p>

        <p className="mt-2 text-3xl font-bold text-green-400">
          {loading ? "..." : atDock}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">
          Terminées
        </p>

        <p className="mt-2 text-3xl font-bold text-orange-400">
          {loading ? "..." : finished}
        </p>
      </div>
    </div>
  );
}