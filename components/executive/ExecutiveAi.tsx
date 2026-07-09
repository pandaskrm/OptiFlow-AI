export default function ExecutiveAi() {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <h2 className="text-xl font-bold">🤖 IA Direction</h2>

      <p className="mt-4 text-sm text-slate-300">
        L'exploitation est globalement sous contrôle avec un score de santé de
        94/100. La priorité du matin concerne la préparation, où la charge est
        élevée sur les allées 9 à 12.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold text-cyan-300">Synthèse exécutive</p>
        <p className="mt-2 text-sm text-slate-300">
          Les réceptions et expéditions sont stables. Le risque principal vient
          des absences et du volume de commandes prioritaires à préparer avant midi.
        </p>
      </div>
    </section>
  );
}