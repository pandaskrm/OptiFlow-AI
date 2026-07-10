"use client";

import { useEffect, useState } from "react";
import useDemo from "../../hooks/useDemo";

type ReceptionStatsProps = {
  refreshKey: number;
};

type Reception = {
  id: number;
  status: string;
};

const STORAGE_KEY = "optiflow_receptions";

export default function ReceptionStats({
  refreshKey,
}: ReceptionStatsProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const demo = useDemo();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    setReceptions(data);
  }, [refreshKey]);

  const total = demo.running
    ? demo.state.completedToday + demo.state.activeReceptions
    : receptions.length;

  const planned = demo.running
    ? Math.max(
        0,
        demo.state.activeReceptions - demo.state.occupiedDocks
      )
    : receptions.filter((r) => r.status === "Planifiée").length;

  const atDock = demo.running
    ? demo.state.occupiedDocks
    : receptions.filter((r) => r.status === "À quai").length;

  const finished = demo.running
    ? demo.state.completedToday
    : receptions.filter((r) => r.status === "Terminée").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">Total réceptions</p>
        <p className="text-3xl font-bold mt-2">{total}</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">Planifiées</p>
        <p className="text-3xl font-bold text-blue-400 mt-2">
          {planned}
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">À quai</p>
        <p className="text-3xl font-bold text-green-400 mt-2">
          {atDock}
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">Terminées</p>
        <p className="text-3xl font-bold text-orange-400 mt-2">
          {finished}
        </p>
      </div>
    </div>
  );
}