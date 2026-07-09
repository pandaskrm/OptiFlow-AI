const decisions = [
  {
    priority: "Haute",
    title: "Renforcer les allées 9 à 12",
    action: "Affecter Karim en renfort de 8h à 11h.",
    impact: "Réduction estimée du retard : 35 min",
  },
  {
    priority: "Moyenne",
    title: "Prioriser les Chronopost",
    action: "Traiter les commandes transport urgent avant 13h30.",
    impact: "Maintien du taux de service au-dessus de 98 %",
  },
  {
    priority: "Basse",
    title: "Reporter les commandes non urgentes",
    action: "Déplacer 12 commandes faibles priorité après 14h.",
    impact: "Meilleure fluidité sur le pic du matin",
  },
];

function priorityStyle(priority: string) {
  if (priority === "Haute") return "bg-red-100 text-red-700";
  if (priority === "Moyenne") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function PreparationDecisionPanel() {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
          Copilote décisionnel
        </p>
        <h2 className="text-xl font-bold">Actions recommandées</h2>
      </div>

      <div className="space-y-4">
        {decisions.map((decision) => (
          <div
            key={decision.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold text-white">{decision.title}</h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyle(
                  decision.priority
                )}`}
              >
                {decision.priority}
              </span>
            </div>

            <p className="text-sm text-slate-300">{decision.action}</p>
            <p className="mt-2 text-sm font-semibold text-cyan-300">
              {decision.impact}
            </p>

            <div className="mt-4 flex gap-2">
              <button className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-400">
                Valider
              </button>

              <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
                Ignorer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}