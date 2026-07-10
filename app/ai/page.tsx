import MainLayout from "../../components/layout/MainLayout";

export default function AIPage() {
  return (
    <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-cyan-400">🤖 IA OptiFlow</h1>
          <p className="mt-6 text-xl text-gray-400">
            Ce module est en cours de développement.
          </p>
          <p className="mt-2 text-gray-500">
            Il sera disponible dans une prochaine mise à jour d'OptiFlow AI.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}