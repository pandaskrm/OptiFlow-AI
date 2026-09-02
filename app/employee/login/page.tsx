"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          portal: "EMPLOYEE",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Impossible de vous connecter.",
        );
        return;
      }

      if (!data.employee) {
        setError(
          "Ce compte n'est pas un compte salarié Organ•IA.",
        );
        return;
      }

      router.push("/employee");
      router.refresh();
    } catch {
      setError(
        "Une erreur est survenue. Réessayez.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
        <header className="mb-12">
          <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Espace salarié
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Organ•IA Salarié
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Connectez-vous à votre espace personnel pour
            accéder à votre présence, vos heures et vos
            informations.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Connexion
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Utilisez votre compte salarié Organ•IA.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Adresse e-mail
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="prenom.nom@email.fr"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Votre mot de passe"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Connexion..."
                : "Me connecter"}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Première connexion ?
            </p>

            <Link
              href="/employee/join"
              className="mt-3 inline-flex font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Créer mon accès salarié →
            </Link>
          </div>
        </section>

        <div className="mt-auto pt-10 text-center">
          <p className="text-xs text-slate-600">
            Organ•IA Salarié · Espace personnel
          </p>
        </div>
      </div>
    </main>
  );
}
