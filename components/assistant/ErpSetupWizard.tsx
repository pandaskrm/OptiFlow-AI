"use client";

type Props = {
  open: boolean;
};

export default function ErpSetupWizard({ open }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">
          Assistant de connexion ERP
        </h2>

        <div className="space-y-4">

          <div>
            <h3 className="font-semibold">Étape 1</h3>
            <p>Choisissez votre ERP</p>

            <select className="mt-2 w-full rounded border p-2">
              <option>Sage</option>
              <option>SAP</option>
              <option>Odoo</option>
              <option>Cegid</option>
              <option>Dynamics 365</option>
              <option>API personnalisée</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold">Étape 2</h3>
            <p>Configuration</p>

            <input
              className="mt-2 w-full rounded border p-2"
              placeholder="URL ERP"
            />

            <input
              className="mt-2 w-full rounded border p-2"
              placeholder="Clé API"
            />
          </div>

          <div>
            <button className="rounded bg-blue-600 px-5 py-2 text-white">
              Tester la connexion
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
