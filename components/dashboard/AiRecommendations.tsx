"use client";

type AiRecommendationsProps = {
  mainPriority: string;
  aiAdvice: string;
  occupiedDocks: number;
  hasData: boolean;
};

export default function AiRecommendations({
  mainPriority,
  aiAdvice,
  occupiedDocks,
  hasData,
}: AiRecommendationsProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">
        🤖 Recommandations IA
      </h2>

      {hasData ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="font-bold text-cyan-400">
              Priorité
            </h3>

            <p className="mt-2 text-slate-300">
              {mainPriority}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="font-bold text-cyan-400">
              Analyse IA
            </h3>

            <p className="mt-2 text-slate-300">
              {aiAdvice}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="font-bold text-cyan-400">
              Quais
            </h3>

            <p className="mt-2 text-slate-300">
              {occupiedDocks}/6 quais actuellement occupés.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-6 text-center text-slate-400">
          Connectez votre ERP ou activez le Mode Démo pour obtenir des recommandations IA.
        </div>
      )}
    </section>
  );
}