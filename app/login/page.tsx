"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de vous connecter."
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-700 to-slate-950 p-8 text-white sm:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em]">
              OptiFlow AI
            </span>

            <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Pilotez votre entrepôt avec l’IA.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-cyan-50/90 sm:text-xl">
              Une plateforme unique pour superviser les opérations, les équipes,
              les quais et les performances en temps réel.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 sm:grid-cols-2">
            {[
              "Pilotage temps réel",
              "KPI opérationnels",
              "Gestion des équipes",
              "Rôles et permissions",
              "Multi-entrepôts",
              "Recommandations IA",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <p className="font-semibold">✓ {item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center p-8 sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-lg">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Espace sécurisé
            </p>

            <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">
              Connexion
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              Accédez à votre environnement OptiFlow AI et à vos outils de
              pilotage logistique.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Adresse e-mail
                </label>

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                  placeholder="vous@entreprise.fr"
                  className="h-14 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-slate-300">
                    Mot de passe
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                  placeholder="Votre mot de passe"
                  className="h-14 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-cyan-600 text-lg font-bold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </button>

              <Link
                href="/register"
                className="flex h-14 w-full items-center justify-center rounded-xl border border-slate-700 text-base font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-white"
              >
                Créer une entreprise
              </Link>
            </form>

            <div className="mt-10 border-t border-slate-800 pt-6">
              <p className="text-center text-sm text-slate-500">
                © 2026 OptiFlow AI — Plateforme logistique intelligente
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}