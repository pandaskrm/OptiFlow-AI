import MainLayout from "../../components/layout/MainLayout";
import ReceptionForm from "../../components/reception/ReceptionForm";
import ReceptionStats from "../../components/reception/ReceptionStats";
import ReceptionTable from "../../components/reception/ReceptionTable";

export default function ReceptionPage() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-2">📥 Réception</h1>

      <p className="text-gray-400 mb-8">
        Gérez les arrivées fournisseurs et le suivi des quais.
      </p>

      <ReceptionForm />

      <div className="mt-8">
        <ReceptionStats />
      </div>

      <ReceptionTable />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">🤖 Analyse IA</h2>

        <p className="text-gray-300">
          • Le quai 2 risque d'être saturé entre 10h30 et 11h15.
        </p>

        <p className="text-green-400 font-semibold mt-4">
          ✔ Recommandation : déplacer le prochain camion UPS au quai 4.
        </p>
      </div>
    </MainLayout>
  );
}