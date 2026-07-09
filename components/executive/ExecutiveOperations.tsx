import { executiveOperations } from "@/lib/executive/executiveData";

function statusStyle(status: string) {
  if (status === "Stable") return "bg-emerald-100 text-emerald-700";
  if (status === "Vigilance") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function ExecutiveOperations() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Modules opérationnels</h2>
      <p className="text-sm text-slate-500">État de chaque zone clé.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {executiveOperations.map((item) => (
          <div key={item.module} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-950">{item.module}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(item.status)}`}>
                {item.status}
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-slate-950">{item.score}/100</p>
            <p className="text-sm font-semibold text-cyan-700">{item.volume}</p>
            <p className="mt-3 text-sm text-slate-500">{item.insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}