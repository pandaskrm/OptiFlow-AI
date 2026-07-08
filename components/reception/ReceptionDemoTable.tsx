"use client";

import { useEffect, useState } from "react";
import {
  getWorkflowReceptions,
  initWorkflow,
  startWorkflow,
  subscribeWorkflow,
} from "../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../lib/workflow/workflowEngine";
import {
  getScenario,
  subscribeScenario,
} from "../../lib/scenarios/scenarioStore";

function getScenarioRows(): WorkflowReception[] {
  const scenario = getScenario();

  if (scenario === "black_friday") {
    return [
      { id: 1, receptionNumber: "BF240001", supplier: "Amazon", carrier: "DHL", dock: 1, pallets: 42, status: "arriving", progress: 0 },
      { id: 2, receptionNumber: "BF240002", supplier: "Nike", carrier: "Geodis", dock: 2, pallets: 36, status: "dock", progress: 15 },
      { id: 3, receptionNumber: "BF240003", supplier: "Apple", carrier: "UPS", dock: 3, pallets: 28, status: "unloading", progress: 55 },
      { id: 4, receptionNumber: "BF240004", supplier: "Samsung", carrier: "DB Schenker", dock: 4, pallets: 31, status: "unloading", progress: 70 },
      { id: 5, receptionNumber: "BF240005", supplier: "Adidas", carrier: "Chronopost", dock: 5, pallets: 24, status: "quality", progress: 95 },
      { id: 6, receptionNumber: "BF240006", supplier: "Sony", carrier: "DHL", dock: 6, pallets: 39, status: "planned", progress: 0 },
    ];
  }

  if (scenario === "peak") {
    return [
      { id: 1, receptionNumber: "PK240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 28, status: "dock", progress: 20 },
      { id: 2, receptionNumber: "PK240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 22, status: "unloading", progress: 45 },
      { id: 3, receptionNumber: "PK240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 18, status: "quality", progress: 75 },
      { id: 4, receptionNumber: "PK240004", supplier: "Samsung", carrier: "UPS", dock: 4, pallets: 26, status: "arriving", progress: 0 },
      { id: 5, receptionNumber: "PK240005", supplier: "Sony", carrier: "DB Schenker", dock: 5, pallets: 20, status: "planned", progress: 0 },
    ];
  }

  if (scenario === "transport_issue") {
    return [
      { id: 1, receptionNumber: "TR240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "arriving", progress: 0 },
      { id: 2, receptionNumber: "TR240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "dock", progress: 10 },
      { id: 3, receptionNumber: "TR240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "unloading", progress: 30 },
    ];
  }

  if (scenario === "quality_alert") {
    return [
      { id: 1, receptionNumber: "QA240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "quality", progress: 95 },
      { id: 2, receptionNumber: "QA240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "quality", progress: 90 },
      { id: 3, receptionNumber: "QA240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "unloading", progress: 70 },
      { id: 4, receptionNumber: "QA240004", supplier: "Samsung", carrier: "UPS", dock: 4, pallets: 16, status: "dock", progress: 20 },
    ];
  }

  return [
    { id: 1, receptionNumber: "RE240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "dock", progress: 20 },
    { id: 2, receptionNumber: "RE240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "unloading", progress: 45 },
    { id: 3, receptionNumber: "RE240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "quality", progress: 75 },
  ];
}

function getStatusLabel(status: WorkflowReception["status"]) {
  switch (status) {
    case "planned":
      return "📝 Planifiée";
    case "arriving":
      return "🚚 Camion annoncé";
    case "dock":
      return "🚛 À quai";
    case "unloading":
      return "📦 Déchargement";
    case "quality":
      return "🔍 Contrôle";
    case "completed":
      return "✅ Terminée";
  }
}

export default function ReceptionDemoTable() {
  const [rows, setRows] = useState<WorkflowReception[]>(getScenarioRows());

  useEffect(() => {
    initWorkflow(getScenarioRows());

    const unsubscribeWorkflow = subscribeWorkflow((data) => {
      setRows(data);
    });

    const unsubscribeScenario = subscribeScenario(() => {
      const scenarioRows = getScenarioRows();
      initWorkflow(scenarioRows);
      setRows(scenarioRows);
    });

    startWorkflow();

    return () => {
      unsubscribeWorkflow();
      unsubscribeScenario();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white">
          📋 Pilotage des réceptions (Démo)
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Les réceptions changent selon le scénario actif.
        </p>
      </div>

      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left">Réception</th>
            <th className="p-4 text-left">Fournisseur</th>
            <th className="p-4 text-left">Transporteur</th>
            <th className="p-4 text-left">Quai</th>
            <th className="p-4 text-left">Palettes</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-left">Progression</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-slate-800 transition hover:bg-slate-800/60"
            >
              <td className="p-4 font-bold text-white">
                {row.receptionNumber}
              </td>
              <td className="p-4 text-slate-300">{row.supplier}</td>
              <td className="p-4 text-slate-300">{row.carrier}</td>
              <td className="p-4 text-slate-300">Quai {row.dock}</td>
              <td className="p-4 text-slate-300">{row.pallets}</td>
              <td className="p-4 text-slate-300">
                {getStatusLabel(row.status)}
              </td>

              <td className="p-4">
                <div className="w-40">
                  <div className="mb-1 text-xs text-slate-400">
                    {row.progress} %
                  </div>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                      style={{ width: `${row.progress}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}