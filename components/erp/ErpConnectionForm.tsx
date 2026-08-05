"use client";

import { useEffect, useState } from "react";

import { erpProviderOptions } from "../../lib/erp/config/erpProviders";
import type { ErpConnectionConfig } from "../../lib/erp/config/erpConfig";
import type { ErpProvider } from "../../lib/erp/types";

type ErpApiConnection = {
  provider: ErpProvider;
  name: string;
  apiUrl: string;
  companyId: string;
  enabled: boolean;
  status: string;
  hasApiKey: boolean;
  lastSyncedAt?: string | null;
};

type ErpApiResponse = {
  connection: ErpApiConnection | null;
  error?: string;
};

type ErpSyncSummary = {
  orders: number;
  shipments: number;
  receptions: number;
  stockItems: number;
  employees: number;
};

type ErpSyncResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
  connection?: {
    id: string;
    provider: string;
    name: string;
    status: string;
    lastSyncedAt: string | null;
  };
  summary?: ErpSyncSummary;
};

const defaultConfig: ErpConnectionConfig = {
  provider: "local",
  name: "Base locale",
  apiUrl: "",
  apiKey: "",
  companyId: "",
  enabled: false,
};

function formatSyncDate(value: string | null) {
  if (!value) {
    return "Aucune synchronisation";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ErpConnectionForm() {
  const [provider, setProvider] = useState<ErpProvider>(
    defaultConfig.provider
  );
  const [name, setName] = useState(defaultConfig.name);
  const [apiUrl, setApiUrl] = useState(defaultConfig.apiUrl);
  const [apiKey, setApiKey] = useState(defaultConfig.apiKey);
  const [companyId, setCompanyId] = useState(defaultConfig.companyId);
  const [enabled, setEnabled] = useState(defaultConfig.enabled);
  const [hasSavedApiKey, setHasSavedApiKey] = useState(false);
  const [status, setStatus] = useState("DISCONNECTED");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] =
    useState<ErpSyncSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadConfiguration() {
      try {
        const response = await fetch("/api/erp/config", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as ErpApiResponse;

        if (!response.ok) {
          throw new Error(
            data.error ?? "Impossible de charger la configuration ERP."
          );
        }

        if (!data.connection) {
          return;
        }

        setProvider(data.connection.provider);
        setName(data.connection.name);
        setApiUrl(data.connection.apiUrl);
        setCompanyId(data.connection.companyId);
        setEnabled(data.connection.enabled);
        setStatus(data.connection.status);
        setHasSavedApiKey(data.connection.hasApiKey);
        setLastSyncedAt(data.connection.lastSyncedAt ?? null);
      } catch (error) {
        setIsError(true);
        setMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger la configuration ERP."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadConfiguration();
  }, []);

  const selectedProvider = erpProviderOptions.find(
    (option) => option.value === provider
  );

  const operationInProgress = testing || saving || syncing;

  async function handleTestConnection() {
    setTesting(true);
    setMessage("");
    setIsError(false);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (provider === "local") {
      setMessage("La base locale OptiFlow AI est disponible.");
    } else if (provider === "csv") {
      setMessage("Le mode d'import CSV est prêt à être configuré.");
    } else if (!apiUrl.trim()) {
      setIsError(true);
      setMessage("Veuillez renseigner l'URL de l'API avant de tester.");
    } else {
      setMessage(
        "La configuration est valide. Le test réel sera activé avec le connecteur ERP."
      );
    }

    setTesting(false);
  }

  async function handleSaveConfiguration() {
    setSaving(true);
    setMessage("");
    setIsError(false);

    const config: ErpConnectionConfig = {
      provider,
      name: name.trim() || selectedProvider?.label || "Connexion ERP",
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
      companyId: companyId.trim(),
      enabled,
    };

    try {
      const response = await fetch("/api/erp/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = (await response.json()) as ErpApiResponse & {
        success?: boolean;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible d'enregistrer la configuration ERP."
        );
      }

      if (data.connection) {
        setProvider(data.connection.provider);
        setName(data.connection.name);
        setApiUrl(data.connection.apiUrl);
        setCompanyId(data.connection.companyId);
        setEnabled(data.connection.enabled);
        setStatus(data.connection.status);
        setHasSavedApiKey(data.connection.hasApiKey);
        setLastSyncedAt(data.connection.lastSyncedAt ?? null);
      }

      setApiKey("");
      setSyncSummary(null);
      setMessage(
        "La configuration ERP a été enregistrée pour votre entreprise."
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la configuration ERP."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSynchronize() {
    setSyncing(true);
    setStatus("CONNECTING");
    setMessage("Synchronisation ERP en cours...");
    setIsError(false);
    setSyncSummary(null);

    try {
      const response = await fetch("/api/erp/sync", {
        method: "POST",
      });

      const data = (await response.json()) as ErpSyncResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            data.details ??
            "Impossible de synchroniser les données ERP."
        );
      }

      setStatus(data.connection?.status ?? "CONNECTED");
      setLastSyncedAt(data.connection?.lastSyncedAt ?? null);
      setSyncSummary(data.summary ?? null);
      setMessage(
        data.message ?? "Synchronisation ERP terminée avec succès."
      );
    } catch (error) {
      setStatus("ERROR");
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "La synchronisation ERP a échoué."
      );
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-sm text-slate-500">
          Chargement de la configuration ERP...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
              Connexion ERP
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Configurer une source de données
            </h2>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
              {status}
            </span>

            <span className="text-xs text-slate-600">
              Dernière synchronisation : {formatSyncDate(lastSyncedAt)}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sélectionnez votre ERP et renseignez les informations nécessaires à la
          synchronisation avec OptiFlow AI.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fournisseur ERP
          </label>

          <select
            value={provider}
            onChange={(event) => {
              const value = event.target.value as ErpProvider;
              const option = erpProviderOptions.find(
                (item) => item.value === value
              );

              setProvider(value);
              setName(option?.label ?? "");
              setMessage("");
              setSyncSummary(null);
              setIsError(false);
            }}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            {erpProviderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="mt-2 text-sm font-medium text-slate-700">
            {selectedProvider?.description}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nom de la connexion
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Exemple : ERP principal"
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            URL de l'API
          </label>

          <input
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
            placeholder="https://erp.entreprise.fr/api"
            disabled={provider === "local" || provider === "csv"}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Identifiant entreprise
          </label>

          <input
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            placeholder="Exemple : societe-001"
            disabled={provider === "local" || provider === "csv"}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Clé API
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={
              hasSavedApiKey
                ? "Clé déjà enregistrée - laissez vide pour la conserver"
                : "Votre clé API sécurisée"
            }
            disabled={provider === "local" || provider === "csv"}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {hasSavedApiKey && (
            <p className="mt-2 text-sm text-emerald-400">
              Une clé API chiffrée est déjà enregistrée.
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 lg:col-span-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
          />

          <span className="text-sm font-medium text-slate-300">
            Activer cette connexion ERP
          </span>
        </label>
      </div>

      {message && (
        <div
          className={
            isError
              ? "mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100"
              : "mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100"
          }
        >
          {message}
        </div>
      )}

      {syncSummary && (
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Résumé de la synchronisation
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">
                Commandes
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {syncSummary.orders}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">
                Expéditions
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {syncSummary.shipments}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">
                Réceptions
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {syncSummary.receptions}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">
                Articles en stock
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {syncSummary.stockItems}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">
                Collaborateurs
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {syncSummary.employees}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={operationInProgress}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {testing ? "Test en cours..." : "Tester la connexion"}
        </button>

        <button
          type="button"
          onClick={handleSaveConfiguration}
          disabled={operationInProgress}
          className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer la configuration"}
        </button>

        <button
          type="button"
          onClick={handleSynchronize}
          disabled={operationInProgress || !enabled}
          className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 font-bold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {syncing
            ? "Synchronisation en cours..."
            : "Lancer la synchronisation"}
        </button>
      </div>

      {!enabled && (
        <p className="mt-3 text-xs text-slate-600">
          Activez et enregistrez la connexion ERP avant de lancer une
          synchronisation.
        </p>
      )}
    </section>
  );
}