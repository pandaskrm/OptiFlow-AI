const absentPickers = [
  { name: "Lucas Martin", reason: "Maladie", returnDate: "12/07" },
  { name: "Emma Rossi", reason: "Congés", returnDate: "15/07" },
];

const teamAreas = [
  { area: "Allées 1-4", staff: 7 },
  { area: "Allées 5-8", staff: 5 },
  { area: "Allées 9-12", staff: 4 },
  { area: "Contrôle", staff: 3 },
  { area: "Expédition", staff: 3 },
];

export default function PreparationTeamStatus() {
  const planned = 24;
  const present = 22;
  const absent = absentPickers.length;
  const breakCount = 3;
  const tempWorkers = 2;
  const maxStaff = Math.max(...teamAreas.map((item) => item.staff));

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 rounded-3xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Équipe du jour</h2>
        <p className="text-sm font-medium text-slate-300">
          Présence, absences et répartition opérationnelle.
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-4 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
          <p className="text-sm font-medium text-slate-300">Prévus</p>
          <p className="text-2xl font-bold text-white">{planned}</p>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300">Présents</p>
          <p className="text-2xl font-bold text-emerald-300">{present}</p>
        </div>

        <div className="rounded-2xl bg-red-500/10 p-4">
          <p className="text-sm text-red-300">Absents</p>
          <p className="text-2xl font-bold text-red-300">{absent}</p>
        </div>

        <div className="rounded-2xl bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">En pause</p>
          <p className="text-2xl font-bold text-amber-300">{breakCount}</p>
        </div>

        <div className="rounded-2xl bg-[#00e5ff]/8 p-4">
          <p className="text-sm text-[#00e5ff]">Intérim</p>
          <p className="text-2xl font-bold text-[#00e5ff]">{tempWorkers}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#008cff]/30 bg-[#020617]/45 p-4 shadow-[inset_0_0_18px_rgba(0,107,255,0.04)]">
          <h3 className="mb-3 font-bold text-white">Préparateurs absents</h3>

          <div className="space-y-3">
            {absentPickers.map((picker) => (
              <div
                key={picker.name}
                className="flex items-center justify-between rounded-xl bg-red-500/10 p-3"
              >
                <div>
                  <p className="font-semibold text-white">{picker.name}</p>
                  <p className="text-sm text-red-300">{picker.reason}</p>
                </div>

                <p className="text-sm font-bold text-slate-300">
                  Retour {picker.returnDate}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#008cff]/30 bg-[#020617]/45 p-4 shadow-[inset_0_0_18px_rgba(0,107,255,0.04)]">
          <h3 className="mb-3 font-bold text-white">Répartition équipe</h3>

          <div className="space-y-3">
            {teamAreas.map((item) => (
              <div key={item.area}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">{item.area}</span>
                  <span className="font-bold text-white">{item.staff}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-[#008cff]/20 bg-[#020617]">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[#006bff] to-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.50)]"
                    style={{ width: `${(item.staff / maxStaff) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#006bff]/35 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-4 text-white">
        <p className="font-semibold text-[#00e5ff]">Analyse IA équipe</p>
        <p className="mt-2 text-sm text-slate-300">
          2 préparateurs sont absents aujourd'hui. Les allées 9 à 12 sont les
          plus sensibles avec seulement 4 personnes. Il est recommandé
          d'affecter un renfort temporaire sur cette zone entre 8h et 11h.
        </p>
      </div>
    </section>
  );
}