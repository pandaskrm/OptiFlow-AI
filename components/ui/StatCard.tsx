import Card from "./Card";

type StatCardProps = {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
};

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = "text-white",
}: StatCardProps) {
  return (
    <Card className="transition hover:border-blue-500 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-3xl">{icon}</span>

        {subtitle && (
          <span className={`text-sm font-semibold ${color}`}>
            {subtitle}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-sm text-slate-400">
        {title}
      </h3>

      <p className={`text-4xl font-bold ${color}`}>
        {value}
      </p>
    </Card>
  );
}