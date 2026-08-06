"use client";

import { useEffect, useMemo, useState } from "react";

type BusinessRule = {
  id: string;
  name: string;
  scope: string;
  targetValue: string;
  priority: string;
  badge: string | null;
  color: string | null;
  workflow: string | null;
  explanation: string | null;
  checklist: unknown;
  actions: unknown;
  isActive: boolean;
};

type RulesResponse = {
  rules?: BusinessRule[];
  rule?: BusinessRule;
  error?: string;
};

const scopeLabels: Record<string, string> = {
  CLIENT: "Client",
  PAYS: "Pays",
  TRANSPORTEUR: "Transporteur",
  ARTICLE: "Article",
};

const priorityLabels: Record<string, string> = {
  NORMALE: "Normale",
  HAUTE: "Haute",
  CRITIQUE: "Critique",
};

export default function BusinessRulesAdminPanel() {
  const [rules, setRules] = useState<BusinessRule[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importingLca, setImportingLca] =
    useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const [name, setName] = useState("");
  const [scope, setScope] = useState("CLIENT");
  const [targetValue, setTargetValue] =
    useState("");
  const [priority, setPriority] =
    useState("NORMALE");
  const [badge, setBadge] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [explanation, setExplanation] =
    useState("");
  const [checklistText, setChecklistText] =
    useState("");

  async function loadRules() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/business-rules",
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as RulesResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Chargement des règles impossible.",
        );
      }

      setRules(data.rules ?? []);
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Chargement impossible.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRules();
  }, []);

  const counters = useMemo(
    () => ({
      total: rules.length,
      active: rules.filter((rule) => rule.isActive)
        .length,
      critical: rules.filter(
        (rule) => rule.priority === "CRITIQUE",
      ).length,
      clients: rules.filter(
        (rule) => rule.scope === "CLIENT",
      ).length,
    }),
    [rules],
  );

  async function importLcaRules() {
    const confirmed = window.confirm(
      "Importer les clients prioritaires, grossistes et procédures export LCA ?",
    );

    if (!confirmed) {
      return;
    }

    setImportingLca(true);
    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        "/api/business-rules/import-lca",
        {
          method: "POST",
        },
      );

      const data =
        (await response.json()) as RulesResponse & {
          message?: string;
        };

      if (!response.ok || !data.rules) {
        throw new Error(
          data.error ??
            "Import des règles LCA impossible.",
        );
      }

      setRules(data.rules);
      setFeedback(
        data.message ??
          "Règles LCA importées.",
      );
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Import impossible.",
      );
    } finally {
      setImportingLca(false);
    }
  }

  async function createRule(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setFeedback("");
    setIsError(false);

    const checklist = checklistText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await fetch(
        "/api/business-rules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            scope,
            targetValue,
            priority,
            badge,
            workflow,
            explanation,
            checklist,
            actions: [],
          }),
        },
      );

      const data =
        (await response.json()) as RulesResponse;

      if (!response.ok || !data.rule) {
        throw new Error(
          data.error ?? "Création impossible.",
        );
      }

      setRules((currentRules) =>
        [...currentRules, data.rule as BusinessRule].sort(
          (first, second) =>
            first.targetValue.localeCompare(
              second.targetValue,
              "fr",
            ),
        ),
      );

      setName("");
      setTargetValue("");
      setBadge("");
      setWorkflow("");
      setExplanation("");
      setChecklistText("");

      setFeedback("Règle métier créée.");
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Création impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(rule: BusinessRule) {
    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        `/api/business-rules/${rule.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !rule.isActive,
          }),
        },
      );

      const data =
        (await response.json()) as RulesResponse;

      if (!response.ok || !data.rule) {
        throw new Error(
          data.error ?? "Mise à jour impossible.",
        );
      }

      setRules((currentRules) =>
        currentRules.map((currentRule) =>
          currentRule.id === rule.id
            ? (data.rule as BusinessRule)
            : currentRule,
        ),
      );
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Mise à jour impossible.",
      );
    }
  }

  async function deleteRule(rule: BusinessRule) {
    const confirmed = window.confirm(
      `Supprimer la règle « ${rule.name} » ?`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        `/api/business-rules/${rule.id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        (await response.json()) as RulesResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Suppression impossible.",
        );
      }

      setRules((currentRules) =>
        currentRules.filter(
          (currentRule) =>
            currentRule.id !== rule.id,
        ),
      );

      setFeedback("Règle supprimée.");
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Suppression impossible.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
            Rule Engine
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Règles métier
          </h2>

          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Configurez les priorités, workflows et
            contrôles spécifiques aux clients, pays,
            transporteurs ou articles.
          </p>

          <button
            type="button"
            onClick={importLcaRules}
            disabled={importingLca || saving}
            className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {importingLca
              ? "Import des règles LCA..."
              : "📥 Importer les règles LCA"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          <Counter label="Total" value={counters.total} />
          <Counter
            label="Actives"
            value={counters.active}
          />
          <Counter
            label="Critiques"
            value={counters.critical}
          />
          <Counter
            label="Clients"
            value={counters.clients}
          />
        </div>
      </div>

      <form
        onSubmit={createRule}
        className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Nom de la règle">
            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              placeholder="Client prioritaire"
              className="input"
            />
          </Field>

          <Field label="Type">
            <select
              value={scope}
              onChange={(event) =>
                setScope(event.target.value)
              }
              className="input"
            >
              <option value="CLIENT">Client</option>
              <option value="PAYS">Pays</option>
              <option value="TRANSPORTEUR">
                Transporteur
              </option>
              <option value="ARTICLE">Article</option>
            </select>
          </Field>

          <Field label="Valeur ciblée">
            <input
              value={targetValue}
              onChange={(event) =>
                setTargetValue(event.target.value)
              }
              required
              placeholder="ALPHA"
              className="input"
            />
          </Field>

          <Field label="Priorité">
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="input"
            >
              <option value="NORMALE">Normale</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </Field>

          <Field label="Badge">
            <input
              value={badge}
              onChange={(event) =>
                setBadge(event.target.value)
              }
              placeholder="⭐ Prioritaire"
              className="input"
            />
          </Field>

          <Field label="Workflow">
            <input
              value={workflow}
              onChange={(event) =>
                setWorkflow(event.target.value)
              }
              placeholder="Préparation prioritaire"
              className="input"
            />
          </Field>

          <Field label="Explication">
            <input
              value={explanation}
              onChange={(event) =>
                setExplanation(event.target.value)
              }
              placeholder="Client à traiter en priorité"
              className="input"
            />
          </Field>

          <Field label="Checklist (une ligne par tâche)">
            <textarea
              value={checklistText}
              onChange={(event) =>
                setChecklistText(event.target.value)
              }
              rows={3}
              placeholder={"Facture\nDocument douane"}
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {feedback ? (
            <p
              className={`text-sm font-semibold ${
                isError
                  ? "text-red-300"
                  : "text-emerald-300"
              }`}
            >
              {feedback}
            </p>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
          >
            {saving
              ? "Création..."
              : "Ajouter la règle"}
          </button>
        </div>
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">
            Chargement des règles...
          </p>
        ) : rules.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">
            Aucune règle configurée.
          </p>
        ) : (
          <div className="divide-y divide-slate-700">
            {rules.map((rule) => (
              <article
                key={rule.id}
                className="grid gap-3 bg-slate-900/80 p-4 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                      {scopeLabels[rule.scope] ??
                        rule.scope}
                    </span>

                    <span className="rounded-full border border-slate-600 px-2.5 py-1 text-xs font-bold text-slate-300">
                      {priorityLabels[rule.priority] ??
                        rule.priority}
                    </span>

                    {rule.badge && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                        {rule.badge}
                      </span>
                    )}

                    {!rule.isActive && (
                      <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs font-bold text-slate-300">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-bold text-white">
                    {rule.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-300">
                    {rule.targetValue}
                  </p>

                  {rule.workflow && (
                    <p className="mt-2 text-sm text-slate-300">
                      Workflow : {rule.workflow}
                    </p>
                  )}

                  {rule.explanation && (
                    <p className="mt-1 text-sm text-slate-400">
                      {rule.explanation}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => toggleRule(rule)}
                    className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-500"
                  >
                    {rule.isActive
                      ? "Désactiver"
                      : "Activer"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRule(rule)}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(71 85 105);
          background: rgb(15 23 42);
          padding: 0.7rem 0.85rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(6 182 212);
        }
      `}</style>
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
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>

      {children}
    </label>
  );
}

function Counter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
      <p className="text-xl font-black text-white">
        {value}
      </p>

      <p className="text-[10px] font-bold uppercase text-slate-400">
        {label}
      </p>
    </div>
  );
}
