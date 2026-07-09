"use client";

import { useEffect, useState } from "react";
import { shippingOrders } from "@/lib/shipping/shippingData";
import type { ShippingOrder, ShippingStatus } from "@/lib/shipping/shippingTypes";

const customers = ["Amazon", "Carrefour", "Nike", "L'Oréal", "Samsung", "Pharmacie Marseille"];
const carriers = ["Chronopost", "DHL", "Geodis", "DB Schenker", "UPS"];

function getStatus(progress: number): ShippingStatus {
  if (progress >= 100) return "Expédiée";
  if (progress >= 85) return "Contrôle transport";
  if (progress >= 35) return "Chargement";
  if (progress > 0) return "En préparation quai";
  return "En attente";
}

function createNewShipping(index: number): ShippingOrder {
  return {
    id: `EXP24${Math.floor(1000 + Math.random() * 8999)}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    carrier: carriers[Math.floor(Math.random() * carriers.length)],
    dock: `Quai ${index + 1}`,
    priority: Math.random() > 0.65 ? "Haute" : Math.random() > 0.35 ? "Moyenne" : "Basse",
    status: "En attente",
    parcels: Math.floor(25 + Math.random() * 90),
    pallets: Math.floor(2 + Math.random() * 8),
    progress: 0,
    departureTime: `${11 + index}:${Math.random() > 0.5 ? "15" : "45"}`,
  };
}

function priorityStyle(priority: string) {
  if (priority === "Haute") return "bg-red-100 text-red-700";
  if (priority === "Moyenne") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function statusStyle(status: string) {
  if (status === "Expédiée") return "bg-emerald-100 text-emerald-700";
  if (status === "Contrôle transport") return "bg-blue-100 text-blue-700";
  if (status === "Chargement") return "bg-cyan-100 text-cyan-700";
  return "bg-slate-100 text-slate-700";
}

export default function ShippingTable() {
  const [orders, setOrders] = useState<ShippingOrder[]>(shippingOrders);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((current) =>
        current.map((order, index) => {
          if (order.progress >= 100) return createNewShipping(index);

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
          <h2 className="text-xl font-bold text-slate-950">Expéditions live</h2>
          <p className="text-sm text-slate-500">
            Suivi des départs transporteurs en temps réel.
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
              <th className="px-4 py-3">Expédition</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Transporteur</th>
              <th className="px-4 py-3">Quai</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Colis</th>
              <th className="px-4 py-3">Avancement</th>
              <th className="px-4 py-3">Départ</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="text-slate-700 transition hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-950">{order.id}</td>
                <td className="px-4 py-4">{order.customer}</td>
                <td className="px-4 py-4">{order.carrier}</td>
                <td className="px-4 py-4">{order.dock}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(order.priority)}`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-4 py-4">{order.parcels}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="font-semibold">{order.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium">{order.departureTime}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}