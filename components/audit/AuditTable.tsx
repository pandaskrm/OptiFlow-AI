"use client";

import { useCallback, useEffect, useState } from "react";

type AuditActor = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: unknown;
  ipAddress: string | null;
  createdAt: string;
  actor: AuditActor | null;
};

type AuditResponse = {
  logs: AuditLog[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getActorName(actor: AuditActor | null) {
  if (!actor) {
    return "Système";
  }

  const fullName = [actor.firstName, actor.lastName]
    .filter(Boolean)
    .join(" ");

  return fullName || actor.email;
}

function getEntityLabel(log: AuditLog) {
  if (!log.entityId) {
    return "—";
  }

  return log.entityId.length > 18
    ? `${log.entityId.slice(0, 18)}…`
    : log.entityId;
}

export default function AuditTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "25",
      });

      if (action.trim()) {
        params.set("action", action.trim());
      }

      if (entityType.trim()) {
        params.set("entityType", entityType.trim());
      }

      const response = await fetch(
        `/api/admin/audit?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = (await response.json()) as
        | AuditResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Impossible de charger le journal d’audit."
        );
      }

      const auditData = data as AuditResponse;

      setLogs(auditData.logs);
      setTotal(auditData.pagination.total);
      setTotalPages(auditData.pagination.totalPages);
    } catch (loadError) {
      setLogs([]);
      setTotal(0);
      setTotalPages(1);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setLoading(false);
    }
  }, [action, entityType, page]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  function applyFilters() {
    if (page === 1) {
      void loadLogs();
      return;
    }

    setPage(1);
  }

  function resetFilters() {
    setAction("");
    setEntityType("");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto_auto]">
        <input
          type="text"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Filtrer par action"
          className="rounded-xl border px-4 py-2 text-sm outline-none transition focus:border-slate-500"
        />

        <input
          type="text"
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          placeholder="Filtrer par type"
          className="rounded-xl border px-4 py-2 text-sm outline-none transition focus:border-slate-500"
        />

        <button
          type="button"
          onClick={applyFilters}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Appliquer
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
        >
          Réinitialiser
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Activité de l’entreprise
            </h2>

            <p className="text-sm font-medium text-slate-700">
              {total} événement{total > 1 ? "s" : ""} enregistré
              {total > 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadLogs()}
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Actualiser
          </button>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">
                    Objet
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-600"
                    >
                      Chargement du journal d’audit…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-600"
                    >
                      Aucun événement enregistré.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {getActorName(log.actor)}
                        </p>

                        {log.actor ? (
                          <p className="text-xs text-slate-600">
                            {log.actor.email}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {log.entityType}
                      </td>

                      <td
                        className="px-6 py-4 font-mono text-xs text-slate-600"
                        title={log.entityId ?? undefined}
                      >
                        {getEntityLabel(log)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm font-medium text-slate-700">
            Page {page} sur {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(1, currentPage - 1)
                )
              }
              disabled={page <= 1 || loading}
              className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Précédent
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(totalPages, currentPage + 1)
                )
              }
              disabled={page >= totalPages || loading}
              className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}