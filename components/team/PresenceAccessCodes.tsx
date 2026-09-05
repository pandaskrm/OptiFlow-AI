"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type AccessCode = {
  key: "EMPLOYEES" | "TEMPORARY";
  label: string;
  contractType: string;
  id: string;
  codeHint: string | null;
  usedCount: number;
  code: string | null;
};

export default function PresenceAccessCodes() {
  const [codes, setCodes] =
    useState<AccessCode[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [regenerating, setRegenerating] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState<string | null>(null);

  const loadCodes = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/presence/manager/access-codes",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Impossible de charger les codes.",
          );
        }

        setCodes(data.accessCodes ?? []);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger les codes.",
        );
      }
      finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadCodes();
  }, [loadCodes]);

  async function regenerate(
    type: AccessCode["key"],
  ) {
    setRegenerating(type);
    setError(null);
    setCopied(null);

    try {
      const response = await fetch(
        "/api/presence/manager/access-codes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            type,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de r?g?n?rer le code.",
        );
      }

      const newCode =
        data.accessCode as AccessCode;

      setCodes((current) =>
        current.map((item) =>
          item.key === type
            ? newCode
            : item,
        ),
      );
    }
    catch (regenerateError) {
      setError(
        regenerateError instanceof Error
          ? regenerateError.message
          : "Impossible de r?g?n?rer le code.",
      );
    }
    finally {
      setRegenerating(null);
    }
  }

  async function copyCode(
    code: string,
    type: string,
  ) {
    try {
      await navigator.clipboard.writeText(
        code,
      );

      setCopied(type);

      window.setTimeout(() => {
        setCopied(null);
      }, 2000);
    }
    catch {
      setError(
        "Impossible de copier le code.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Organ·IA Salarié
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          Accès salariés
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Partagez le code correspondant
          pour permettre aux salariés de
          cr?er leur espace personnel.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">
          Chargement des codes...
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {codes.map((item) => {
            const temporary =
              item.key === "TEMPORARY";

            return (
              <article
                key={item.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {item.label}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {temporary
                        ? "Code commun à tous les intérimaires."
                        : "Code réservé aux salariés embauchés."}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                    {item.usedCount} inscription
                    {item.usedCount > 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  {item.code ? (
                    <>
                      <p className="text-xs text-slate-500">
                        Nouveau code
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <code className="text-base font-bold tracking-wider text-slate-950">
                          {item.code}
                        </code>

                        <button
                          type="button"
                          onClick={() =>
                            void copyCode(
                              item.code!,
                              item.key,
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          {copied === item.key
                            ? "Copi?"
                            : "Copier"}
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-amber-700">
                        Conservez ce code : il
                        ne sera plus affich?
                        apr?s actualisation.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">
                        Code actif
                      </p>

                      <p className="mt-1 font-mono text-base font-semibold tracking-wider text-slate-800">
                        ????????{item.codeHint
                          ? ` ${item.codeHint}`
                          : ""}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Le code complet est
                        masqu? pour des raisons
                        de s?curit?.
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    regenerating !== null
                  }
                  onClick={() =>
                    void regenerate(item.key)
                  }
                  className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {regenerating === item.key
                    ? "G?n?ration..."
                    : item.code
                      ? "R?g?n?rer le code"
                      : "G?n?rer un nouveau code"}
                </button>

                {temporary ? (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    L'agence d'int?rim et la
                    dur?e de mission seront
                    renseign?es s?par?ment par
                    l'intérimaire.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
