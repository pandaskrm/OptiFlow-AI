"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  type FormEvent,
  useMemo,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const portal =
    searchParams.get("portal") === "EMPLOYEE"
      ? "EMPLOYEE"
      : "FLOW";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checks = useMemo(() => {
    const letters = (password.match(/\p{L}/gu) ?? []).length;
    const digits = (password.match(/\d/g) ?? []).length;

    return [
      ["10 caractères minimum", password.length >= 10],
      ["1 majuscule", /\p{Lu}/u.test(password)],
      ["5 lettres minimum", letters >= 5],
      ["2 chiffres minimum", digits >= 2],
      [
        "1 caractère spécial",
        /[^\p{L}\p{N}]/u.test(password),
      ],
    ] as const;
  }, [password]);

  const score = checks.filter(([, valid]) => valid).length;
  const validPassword = score === checks.length;
  const samePassword =
    confirmation.length > 0 && confirmation === password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validPassword) {
      setError(
        "Le mot de passe ne respecte pas tous les critères.",
      );
      return;
    }

    if (!samePassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de modifier le mot de passe.",
        );
      }

      setMessage(data.message ?? "Mot de passe modifié.");
      setPassword("");
      setConfirmation("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  const loginHref =
    portal === "EMPLOYEE" ? "/employee/login" : "/login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
          Organ•IA
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Nouveau mot de passe
        </h1>

        {!token ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            Ce lien de réinitialisation est invalide.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nouveau mot de passe
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 pr-12 outline-none focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {checks.map(([label, valid]) => (
                <p
                  key={label}
                  className={
                    valid
                      ? "text-sm text-emerald-300"
                      : "text-sm text-slate-500"
                  }
                >
                  {valid ? "✓" : "○"} {label}
                </p>
              ))}

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={
                    score === 5
                      ? "h-full bg-emerald-500 transition-all"
                      : score >= 3
                        ? "h-full bg-orange-500 transition-all"
                        : "h-full bg-red-500 transition-all"
                  }
                  style={{ width: `${score * 20}%` }}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirmer le mot de passe
              </label>

              <div className="relative">
                <input
                  type={showConfirmation ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) =>
                    setConfirmation(event.target.value)
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 pr-12 outline-none focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmation((value) => !value)
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400"
                  aria-label={
                    showConfirmation
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirmation ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {confirmation ? (
                <p
                  className={
                    samePassword
                      ? "mt-2 text-sm text-emerald-300"
                      : "mt-2 text-sm text-red-300"
                  }
                >
                  {samePassword
                    ? "Les mots de passe correspondent."
                    : "Les mots de passe ne correspondent pas."}
                </p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !validPassword || !samePassword}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Modification..."
                : "Modifier mon mot de passe"}
            </button>
          </form>
        )}

        <Link
          href={loginHref}
          className="mt-6 flex justify-center text-sm font-semibold text-cyan-300"
        >
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          Chargement...
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
