"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";

function priorityStyle(priority: string) {
  const normalized = priority.toLowerCase();

  if (["haute", "urgente", "critique"].includes(normalized)) {
    return "bg-red-500/15 text-red-300";
  }

  if (["moyenne", "normale"].includes(normalized)) {
    return "bg-amber-500/15 text-amber-300";
  }

  return "bg-emerald-500/15 text-emerald-300";
}

function statusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("termin") || normalized.includes("compl")) {
    return "bg-emerald-500/15 text-emerald-300";
  }

  if (normalized.includes("contr")) {
    return "bg-[#006bff]/15 text-[#66b3ff]";
  }

  if (normalized.includes("prépar") || normalized.includes("prepar")) {
    return "bg-[#00e5ff]/12 text-[#00e5ff]";
  }

  return "bg-[#0b1d33] text-slate-300";
}

function formatDeadline(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function PreparationTable() {
  const { data: warehouse, loading } = useWarehouseSummary();
  const orders = warehouse.orderDetails;

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 rounded-3xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Commandes en préparation
          </h2>

          <p className="text-sm font-medium text-slate-300">
            Activité opérationnelle des commandes du jour.
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
          ● Live
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#008cff]/35 bg-[#020617]/55 shadow-[inset_0_0_22px_rgba(0,107,255,0.04)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-[#006bff]/14 to-[#00e5ff]/5 text-[#9eefff]">
            <tr>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Lignes</th>
              <th className="px-4 py-3">Avancement</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Échéance</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#008cff]/15">
            {orders.map((order) => {
              const progress =
                order.totalLines > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (order.preparedLines / order.totalLines) * 100
                      )
                    )
                  : 0;

              return (
                <tr
                  key={order.id}
                  className="text-slate-300 transition hover:bg-[#006bff]/10"
                >
                  <td className="px-4 py-4 font-semibold text-white">
                    {order.number}
                  </td>

                  <td className="px-4 py-4">{order.customer}</td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(
                        order.priority
                      )}`}
                    >
                      {order.priority}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {order.preparedLines} / {order.totalLines}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full border border-[#008cff]/20 bg-[#020617]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#006bff] to-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.50)] transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <span className="font-semibold">{progress}%</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {formatDeadline(order.scheduledAt)}
                  </td>
                </tr>
              );
            })}

            {!loading && orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Aucune commande opérationnelle disponible.
                </td>
              </tr>
            )}

            {loading && orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Chargement des commandes...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}