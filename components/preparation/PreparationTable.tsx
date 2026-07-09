"use client";

import { useEffect, useState } from "react";
import { preparationOrders } from "@/lib/preparation/preparationData";
import type { PreparationOrder, PreparationStatus } from "@/lib/preparation/preparationTypes";

const customers = ["Amazon", "Carrefour", "Nike", "L'Oréal", "Samsung", "Vape Store Lyon", "Pharmacie Marseille"];
const pickers = ["Lucas", "Emma", "Thomas", "Sarah", "Mehdi", "Inès", "Karim"];

function getStatus(progress: number): PreparationStatus {
  if (progress >= 100) return "Terminée";
  if (progress >= 80) return "Contrôle";
  if (progress > 0) return "En préparation";
  return "En attente";
}

function priorityStyle(priority: string) {
  if (priority === "Haute") return "bg-red-100 text-red-700";
  if (priority === "Moyenne") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function statusStyle(status: string) {
  if (status === "Terminée") return "bg-emerald-100 text-emerald-700";
  if (status === "Contrôle") return "bg-blue-100 text-blue-700";
  if (status === "En préparation") return "bg-cyan-100 text-cyan-700";
  return "bg-slate-100 text-slate-700";
}

function createNewOrder(index: number): PreparationOrder {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const picker = pickers[Math.floor(Math.random() * pickers.length)];
  const priority = Math.random() > 0.65 ? "Haute" : Math.random() > 0.35 ? "Moyenne" : "Basse";

  return {
    id: `CMD24${Math.floor(1000 + Math.random() * 8999)}`,
    customer,
    picker,
    priority,
    status: "En attente",
    progress: 0,
    lines: Math.floor(10 + Math.random() * 45),
    deadline: `${10 + index}:${Math.random() > 0.5 ? "15" : "45"}`,
  };
}

export default function PreparationTable() {
  const [orders, setOrders] = useState<PreparationOrder[]>(preparationOrders);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((currentOrders) =>
        currentOrders.map((order, index) => {
          if (order.progress >= 100) {
            return createNewOrder(index);
          }

          const nextProgress = Math.min(
            100,
            order.progress + Math.floor(4 + Math.random() * 18)
          );

          return {
            ...order,
            progress: nextProgress,
            status: getStatus(nextProgress),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Commandes en préparation
          </h2>
          <p className="text-sm text-slate-500">
            Activité live des préparateurs et commandes du jour.
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          ● Live
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Préparateur</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Lignes</th>
              <th className="px-4 py-3">Avancement</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Échéance</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="text-slate-700 transition hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-950">{order.id}</td>
                <td className="px-4 py-4">{order.customer}</td>
                <td className="px-4 py-4">{order.picker}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(order.priority)}`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium">{order.lines}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-28 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="font-semibold">{order.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium">{order.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}