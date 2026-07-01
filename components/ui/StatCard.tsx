type StatCardProps = {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
};

export default function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-semibold ${color}`}>{subtitle}</span>
      </div>

      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}