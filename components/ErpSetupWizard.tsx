"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ErpSetupWizardProps = {
  onClose: () => void;
};

const erpProviders = [
  "Sage",
  "SAP",
  "Odoo",
  "Microsoft Dynamics",
  "Cegid",
  "API personnalisee",
];

export default function ErpSetupWizard({
  onClose,
}: ErpSetupWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  function openSettings() {
    onClose();
    router.push("/parametres");
  }

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-slate-900 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Assistant ERP
          </p>
          <h3 className="mt-1 font-bold text-white">
            Connexion de votre ERP
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-600">
            Etape {step} sur 3
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-800 hover:text-white"
        >
          X
        </button>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-200">
            Choisissez votre ERP :
          </p>

          <div className="grid grid-cols-2 gap-2">
            {erpProviders.map((erp) => (
              <button
                key={erp}
                type="button"
                onClick={() => setProvider(erp)}
                className={
                  provider === erp
                    ? "rounded-xl border border-cyan-400 bg-cyan-400/10 px-3 py-3 text-xs font-semibold text-cyan-200"
                    : "rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-slate-300 hover:border-cyan-500/50"
                }
              >
                {erp}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!provider}
            onClick={() => setStep(2)}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
          >
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              URL de connexion
            </label>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://erp.entreprise.fr/api"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cle API ou jeton
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Votre cle securisee"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300"
            >
              Retour
            </button>

            <button
              type="button"
              disabled={!url.trim() || !apiKey.trim()}
              onClick={() => setStep(3)}
              className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
            >
              Verifier
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <p className="text-sm font-semibold text-emerald-300">
              Configuration preparee
            </p>
            <p className="mt-1 text-xs text-slate-300">
              ERP : {provider}
            </p>
            <p className="mt-1 break-all text-xs font-medium text-slate-600">
              URL : {url}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Ouvrez maintenant les parametres ERP pour enregistrer,
            tester la connexion et lancer la premiere synchronisation.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300"
            >
              Modifier
            </button>

            <button
              type="button"
              onClick={openSettings}
              className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950"
            >
              Ouvrir les parametres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}