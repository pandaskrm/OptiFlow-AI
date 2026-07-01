type ProgressCardProps = {
  title: string;
  value: number;
};

export default function ProgressCard({
  title,
  value,
}: ProgressCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-blue-400 font-bold">{value}%</span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}