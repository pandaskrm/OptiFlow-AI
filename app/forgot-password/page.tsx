"use client";

import Link from "next/link";
import { Suspense, type FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const portal =
    searchParams.get("portal") === "EMPLOYEE"
      ? "EMPLOYEE"
      : "FLOW";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, portal }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible d’envoyer l’e-mail.",
        );
      }

      setMessage(
        data.message ??
          "Si ce compte existe, un e-mail vient d’être envoyé.",
      );
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
          Organ•IA
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Mot de passe oublié
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Saisissez votre adresse e-mail. Nous vous enverrons un
          lien sécurisé valable pendant 30 minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 outline-none focus:border-cyan-400"
              placeholder="vous@entreprise.fr"
            />
          </div>

          {message ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-bold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer le lien sécurisé"}
          </button>
        </form>

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

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          Chargement...
        </main>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
