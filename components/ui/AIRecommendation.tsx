type AIRecommendationProps = {
  title: string;
  message: string;
  gain: string;
};

export default function AIRecommendation({
  title,
  message,
  gain,
}: AIRecommendationProps) {
  return (
    <div className="rounded-2xl border border-blue-800 bg-gradient-to-br from-slate-900 to-blue-950 p-6">

      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">🤖</div>

        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">
            Intelligence artificielle OptiFlow
          </p>
        </div>
      </div>

      <p className="text-gray-300 leading-7">
        {message}
      </p>

      <div className="mt-6 rounded-xl bg-blue-600/20 border border-blue-700 p-4">

        <p className="text-blue-300 font-semibold">
          Temps gagné estimé
        </p>

        <h3 className="text-3xl font-bold text-green-400 mt-2">
          {gain}
        </h3>

      </div>

    </div>
  );
}