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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-950">Équipe du jour</h2>
        <p className="text-sm text-slate-500">
          Présence, absences et répartition opérationnelle.
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Prévus</p>
          <p className="text-2xl font-bold text-slate-950">{planned}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-600">Présents</p>
          <p className="text-2xl font-bold text-emerald-700">{present}</p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-sm text-red-600">Absents</p>
          <p className="text-2xl font-bold text-red-700">{absent}</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4">
          <p className="text-sm text-amber-600">En pause</p>
          <p className="text-2xl font-bold text-amber-700">{breakCount}</p>
        </div>

        <div className="rounded-2xl bg-cyan-50 p-4">
          <p className="text-sm text-cyan-600">Intérim</p>
          <p className="text-2xl font-bold text-cyan-700">{tempWorkers}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 font-bold text-slate-950">Préparateurs absents</h3>

          <div className="space-y-3">
            {absentPickers.map((picker) => (
              <div
                key={picker.name}
                className="flex items-center justify-between rounded-xl bg-red-50 p-3"
              >
                <div>
                  <p className="font-semibold text-slate-950">{picker.name}</p>
                  <p className="text-sm text-red-600">{picker.reason}</p>
                </div>

                <p className="text-sm font-bold text-slate-700">
                  Retour {picker.returnDate}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 font-bold text-slate-950">Répartition équipe</h3>

          <div className="space-y-3">
            {teamAreas.map((item) => (
              <div key={item.area}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.area}</span>
                  <span className="font-bold text-slate-950">{item.staff}</span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-cyan-500"
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