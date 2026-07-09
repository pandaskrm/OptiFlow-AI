const decisions = [
  {
    priority: "Haute",
    title: "Prioriser Chronopost",
    action: "Finaliser les chargements Chronopost avant 11h30.",
    impact: "Réduction du risque de retard transport",
  },
  {
    priority: "Moyenne",
    title: "Renforcer Quai 4",
    action: "Ajouter un opérateur sur le quai 4 pendant 45 min.",
    impact: "Gain estimé : 22 min",
  },
  {
    priority: "Basse",
    title: "Décaler UPS non urgent",
    action: "Reporter 8 colis UPS après 14h.",
    impact: "Meilleure fluidité sur le pic du matin",
  },
];

function priorityStyle(priority: string) {
  if (priority === "Haute") return "bg-red-100 text-red-700";
  if (priority === "Moyenne") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function ShippingDecisionPanel() {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
        Copilote décisionnel
      </p>
      <h2 className="mt-1 text-xl font-bold">Actions recommandées</h2>

      <div className="mt-5 space-y-4">
        {decisions.map((decision) => (
          <div
            key={decision.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold">{decision.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyle(decision.priority)}`}>
                {decision.priority}
              </span>
            </div>

            <p className="text-sm text-slate-300">{decision.action}</p>
            <p className="mt-2 text-sm font-semibold text-cyan-300">
              {decision.impact}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}