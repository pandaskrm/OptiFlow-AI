"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";

function statusStyle(status: string) {
  const normalized = status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    normalized.includes("expedie") ||
    normalized.includes("termine")
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    normalized.includes("pret") ||
    normalized.includes("controle")
  ) {
    return "bg-cyan-100 text-cyan-700";
  }

  return "bg-slate-100 text-slate-700";
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ShippingTable() {
  const { data: warehouse, loading } = useWarehouseSummary();
  const shipments = warehouse.shipmentDetails;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Expéditions
          </h2>

          <p className="text-sm font-medium text-slate-700">
            Suivi des départs transporteurs depuis les données opérationnelles.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            shipments.length > 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {loading
            ? "Actualisation..."
            : shipments.length > 0
              ? "ERP synchronisé"
              : "En attente ERP"}
        </span>
      </div>

      {shipments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="font-semibold text-slate-800">
            Aucune expédition disponible
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Les expéditions apparaîtront ici après synchronisation des données.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Expédition</th>
                <th className="px-4 py-3">Commande</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Transporteur</th>
                <th className="px-4 py-3">Quai</th>
                <th className="px-4 py-3">Colis</th>
                <th className="px-4 py-3">Palettes</th>
                <th className="px-4 py-3">Départ prévu</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {shipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="text-slate-700 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {shipment.number}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.orderNumber ?? "—"}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.customer}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.carrier}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.dock ?? "—"}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.packages}
                  </td>

                  <td className="px-4 py-4">
                    {shipment.pallets}
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {formatDate(shipment.scheduledAt)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
