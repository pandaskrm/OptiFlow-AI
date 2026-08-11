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
    <section className="rounded-3xl border border-[#006bff]/30 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Équipe du jour</h2>
        <p className="text-sm font-medium text-slate-300">
          Présence, absences et répartition opérationnelle.
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <div className="rounded-2xl bg-[#071426]/90 p-4">
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
        <div className="rounded-2xl border border-[#006bff]/25 p-4">
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

        <div className="rounded-2xl border border-[#006bff]/25 p-4">
          <h3 className="mb-3 font-bold text-white">Répartition équipe</h3>

          <div className="space-y-3">
            {teamAreas.map((item) => (
              <div key={item.area}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">{item.area}</span>
                  <span className="font-bold text-white">{item.staff}</span>
                </div>

                <div className="h-3 rounded-full bg-[#0b1d33]">
                  <div
                    className="h-3 rounded-full bg-[#00e5ff]/80"
                    style={{ width: `${(item.staff / maxStaff) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950 p-4 text-white">
        <p className="font-semibold text-cyan-300">Analyse IA équipe</p>
        <p className="mt-2 text-sm text-slate-300">
          2 préparateurs sont absents aujourd'hui. Les allées 9 à 12 sont les
          plus sensibles avec seulement 4 personnes. Il est recommandé
          d'affecter un renfort temporaire sur cette zone entre 8h et 11h.
        </p>
      </div>
    </section>
  );
}