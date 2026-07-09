const absentStaff = [
  { name: "Nadia Lopez", reason: "Congés", returnDate: "13/07" },
];

const areas = [
  { area: "Quais 1-2", staff: 4 },
  { area: "Quais 3-4", staff: 5 },
  { area: "Contrôle transport", staff: 3 },
  { area: "Emballage", staff: 6 },
];

export default function ShippingTeamStatus() {
  const max = Math.max(...areas.map((item) => item.staff));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Équipe expédition</h2>
      <p className="text-sm text-slate-500">Présence et répartition des équipes.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Prévus</p>
          <p className="text-2xl font-bold text-slate-950">18</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-600">Présents</p>
          <p className="text-2xl font-bold text-emerald-700">17</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-sm text-red-600">Absents</p>
          <p className="text-2xl font-bold text-red-700">1</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-4">
          <p className="text-sm text-cyan-600">Quais actifs</p>
          <p className="text-2xl font-bold text-cyan-700">5</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 font-bold text-slate-950">Absents</h3>
          {absentStaff.map((person) => (
            <div key={person.name} className="rounded-xl bg-red-50 p-3">
              <p className="font-semibold text-slate-950">{person.name}</p>
              <p className="text-sm text-red-600">
                {person.reason} · Retour {person.returnDate}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 font-bold text-slate-950">Répartition</h3>
          <div className="space-y-3">
            {areas.map((item) => (
              <div key={item.area}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.area}</span>
                  <span className="font-bold text-slate-950">{item.staff}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-cyan-500"
                    style={{ width: `${(item.staff / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}