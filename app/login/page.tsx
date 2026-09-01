"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        employee?: boolean;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de vous connecter."
        );
      }

      router.push(
        data.employee
          ? "/employee"
          : "/dashboard",
      );
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-4">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-700 to-slate-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em]">
              OptiFlow AI
            </span>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-50/90">
  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
  </span>

  Système opérationnel
</div>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Pilotez votre entrepôt avec l’IA.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-cyan-50/90 sm:text-lg">
              Une plateforme unique pour superviser les opérations, les équipes,
              les quais et les performances en temps réel.
            </p>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
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
                className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur"
              >
                <p className="font-semibold">✓ {item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-lg">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Espace sécurisé
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Connexion
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Accédez à votre environnement OptiFlow AI et à vos outils de
              pilotage logistique.
            </p>

            <form
              method="post"
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
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
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                    placeholder="Votre mot de passe"
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-cyan-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-center text-xs text-slate-400">
              Vous rejoignez votre entreprise pour la premi?re fois ?
            </p>

            <Link
              href="/employee/join"
              className="mt-3 block w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-center text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/15"
            >
              Je suis salari? / int?rimaire ? Cr?er mon acc?s
            </Link>
          </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <p className="text-center text-sm text-slate-500">
                © 2026 OptiFlow AI • Plateforme logistique intelligente
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}



