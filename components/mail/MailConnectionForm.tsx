"use client";

import { useEffect, useState } from "react";

import {
  MAIL_PROVIDERS,
  type MailProvider,
} from "../../lib/mail/mailTypes";

type MailConnectionResponse = {
  connection?: {
    provider: MailProvider;
    emailAddress: string;
    host: string;
    port: number;
    username: string;
    tenantId: string;
    clientId: string;
    enabled: boolean;
    status: string;
    hasPassword: boolean;
    hasClientSecret: boolean;
  } | null;
  error?: string;
  message?: string;
};

export default function MailConnectionForm() {
  const [provider, setProvider] =
    useState<MailProvider>("MICROSOFT_365");

  const [emailAddress, setEmailAddress] =
    useState("");

  const [host, setHost] = useState("");
  const [port, setPort] = useState(993);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] =
    useState("");

  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] =
    useState("DISCONNECTED");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadConfiguration() {
      try {
        const response = await fetch("/api/mail/config", {
          cache: "no-store",
        });

        const data =
          (await response.json()) as MailConnectionResponse;

        if (!response.ok) {
          throw new Error(
            data.error ??
              "Impossible de charger la messagerie.",
          );
        }

        if (data.connection) {
          setProvider(data.connection.provider);
          setEmailAddress(
            data.connection.emailAddress,
          );
          setHost(data.connection.host);
          setPort(data.connection.port);
          setUsername(data.connection.username);
          setTenantId(data.connection.tenantId);
          setClientId(data.connection.clientId);
          setEnabled(data.connection.enabled);
          setStatus(data.connection.status);
        }
      } catch (error) {
        setIsError(true);
        setMessage(
          error instanceof Error
            ? error.message
            : "Erreur de chargement.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadConfiguration();
  }, []);

  const payload = {
    provider,
    emailAddress,
    host,
    port,
    username,
    password,
    tenantId,
    clientId,
    clientSecret,
    enabled,
  };

  async function testConfiguration() {
    setTesting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/mail/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data =
        (await response.json()) as MailConnectionResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Test impossible.",
        );
      }

      setMessage(
        data.message ??
          "Configuration cohérente.",
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Test impossible.",
      );
    } finally {
      setTesting(false);
    }
  }

  async function saveConfiguration() {
    setSaving(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/mail/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data =
        (await response.json()) as MailConnectionResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Enregistrement impossible.",
        );
      }

      setStatus(
        data.connection?.status ?? "CONFIGURED",
      );

      setPassword("");
      setClientSecret("");

      setMessage(
        "Configuration de messagerie enregistrée.",
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Enregistrement impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-500">
          Chargement de la messagerie...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
            Messagerie intelligente
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Connecter la boîte de réception
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Prépare automatiquement les futures réceptions à partir des avis d'arrivage.
          </p>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold uppercase text-slate-300">
          {status}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Fournisseur">
          <select
            value={provider}
            onChange={(event) =>
              setProvider(
                event.target.value as MailProvider,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none focus:border-cyan-500"
          >
            {MAIL_PROVIDERS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Adresse e-mail">
          <input
            type="email"
            value={emailAddress}
            onChange={(event) =>
              setEmailAddress(event.target.value)
            }
            placeholder="reception@entreprise.fr"
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
          />
        </Field>

        {provider === "IMAP" ? (
          <>
            <Field label="Serveur IMAP">
              <input
                value={host}
                onChange={(event) =>
                  setHost(event.target.value)
                }
                placeholder="imap.entreprise.fr"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </Field>

            <Field label="Port">
              <input
                type="number"
                value={port}
                onChange={(event) =>
                  setPort(
                    Number(event.target.value) || 993,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none focus:border-cyan-500"
              />
            </Field>

            <Field label="Identifiant">
              <input
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none focus:border-cyan-500"
              />
            </Field>

            <Field label="Mot de passe">
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Secret chiffré"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Tenant ID">
              <input
                value={tenantId}
                onChange={(event) =>
                  setTenantId(event.target.value)
                }
                placeholder="Identifiant du tenant"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </Field>

            <Field label="Client ID">
              <input
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                placeholder="Identifiant OAuth"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label="Secret client">
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(event) =>
                    setClientSecret(
                      event.target.value,
                    )
                  }
                  placeholder="Secret OAuth chiffré"
                  className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </Field>
            </div>
          </>
        )}
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-300">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) =>
            setEnabled(event.target.checked)
          }
          className="h-4 w-4 accent-cyan-500"
        />

        Activer la surveillance de cette boîte
      </label>

      {message && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            isError
              ? "border-red-500/20 bg-red-500/10 text-red-200"
              : "border-cyan-500/20 bg-cyan-500/10 text-cyan-100"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={testConfiguration}
          disabled={testing || saving}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          {testing
            ? "Vérification..."
            : "Vérifier la configuration"}
        </button>

        <button
          type="button"
          onClick={saveConfiguration}
          disabled={testing || saving}
          className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 disabled:opacity-50"
        >
          {saving
            ? "Enregistrement..."
            : "Enregistrer"}
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      {children}
    </label>
  );
}
