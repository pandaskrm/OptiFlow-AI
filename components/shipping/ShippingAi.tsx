"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";

export default function ShippingAi() {
  const { data: warehouse, loading } = useWarehouseSummary();
  const shipments = warehouse.shipments;

  const hasData = shipments.total > 0;

  const title = loading
    ? "Analyse expédition en cours"
    : hasData
      ? "Analyse IA expédition"
      : "Données expédition indisponibles";

  const message = hasData
    ? `${shipments.shipped} expédition(s) réalisée(s), ${shipments.ready} prête(s) et ${shipments.waiting} en attente. Taux de service : ${shipments.serviceRate} %.`
    : "Aucune donnée opérationnelle d'expédition n'est disponible pour le moment.";

  const recommendation = !hasData
    ? "Connectez ou synchronisez les données ERP pour obtenir une recommandation opérationnelle."
    : shipments.waiting > 0
      ? "La file d'attente doit être surveillée. Identifiez d'abord la cause réellement constatée avant toute action corrective."
      : shipments.serviceRate < 95
        ? "Le taux de service mérite une analyse des expéditions réellement concernées."
        : "Aucune action corrective majeure n'est nécessaire d'après les indicateurs disponibles.";

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="mt-4 text-sm text-slate-300">
        {message}
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold text-cyan-300">
          Recommandation
        </p>

        <p className="mt-2 text-sm text-slate-300">
          {recommendation}
        </p>
      </div>
    </section>
  );
}
