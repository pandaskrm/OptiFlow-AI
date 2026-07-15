"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type RegisterForm = {
  companyName: string;
  siret: string;
  companyEmail: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  warehouseName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const initialForm: RegisterForm = {
  companyName: "",
  siret: "",
  companyEmail: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  country: "France",
  warehouseName: "Entrepôt principal",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field: keyof RegisterForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function formatSiret(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    const groups = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,5})$/);

    if (!groups) {
      return digits;
    }

    return [groups[1], groups[2], groups[3], groups[4]]
      .filter(Boolean)
      .join(" ");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          siret: form.siret.replace(/\D/g, ""),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de créer votre entreprise."
        );
      }

      setSuccess(
        data.message ?? "Votre entreprise a été créée avec succès."
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 1500);
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            OptiFlow AI
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Créer votre entreprise
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Configurez votre société, votre entrepôt principal et votre
            premier compte administrateur.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sm:p-8 lg:p-10"
        >
          <section>
            <div className="mb-6">
              <p className="text-sm font-bold text-cyan-400">
                Étape 1
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Informations de l’entreprise
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nom de l’entreprise"
                required
                value={form.companyName}
                onChange={(value) =>
                  updateField("companyName", value)
                }
                placeholder="LCA Distribution"
              />

              <Field
                label="Numéro SIRET"
                required
                value={form.siret}
                onChange={(value) =>
                  updateField("siret", formatSiret(value))
                }
                placeholder="123 456 789 00012"
                inputMode="numeric"
              />

              <Field
                label="E-mail professionnel"
                required
                type="email"
                value={form.companyEmail}
                onChange={(value) =>
                  updateField("companyEmail", value)
                }
                placeholder="contact@entreprise.fr"
              />

              <Field
                label="Téléphone"
                type="tel"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="04 00 00 00 00"
              />

              <div className="md:col-span-2">
                <Field
                  label="Adresse"
                  required
                  value={form.address}
                  onChange={(value) =>
                    updateField("address", value)
                  }
                  placeholder="12 avenue de la Logistique"
                />
              </div>

              <Field
                label="Code postal"
                required
                value={form.postalCode}
                onChange={(value) =>
                  updateField(
                    "postalCode",
                    value.replace(/\D/g, "").slice(0, 5)
                  )
                }
                placeholder="13420"
                inputMode="numeric"
              />

              <Field
                label="Ville"
                required
                value={form.city}
                onChange={(value) => updateField("city", value)}
                placeholder="Gémenos"
              />

              <Field
                label="Pays"
                required
                value={form.country}
                onChange={(value) => updateField("country", value)}
              />

              <Field
                label="Entrepôt principal"
                required
                value={form.warehouseName}
                onChange={(value) =>
                  updateField("warehouseName", value)
                }
                placeholder="Entrepôt principal"
              />
            </div>
          </section>

          <div className="border-t border-slate-800" />

          <section>
            <div className="mb-6">
              <p className="text-sm font-bold text-cyan-400">
                Étape 2
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Compte administrateur
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Ce compte pourra inviter les collaborateurs et gérer
                leurs rôles et leurs accès.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Prénom"
                required
                value={form.firstName}
                onChange={(value) =>
                  updateField("firstName", value)
                }
                placeholder="Kevin"
              />

              <Field
                label="Nom"
                required
                value={form.lastName}
                onChange={(value) =>
                  updateField("lastName", value)
                }
                placeholder="Rodrigues"
              />

              <div className="md:col-span-2">
                <Field
                  label="Adresse e-mail de connexion"
                  required
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  placeholder="administrateur@entreprise.fr"
                />
              </div>

              <Field
                label="Mot de passe"
                required
                type="password"
                value={form.password}
                onChange={(value) =>
                  updateField("password", value)
                }
                placeholder="10 caractères minimum"
              />

              <Field
                label="Confirmer le mot de passe"
                required
                type="password"
                value={form.passwordConfirmation}
                onChange={(value) =>
                  updateField("passwordConfirmation", value)
                }
                placeholder="Confirmez le mot de passe"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <footer className="flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/login"
              className="text-center text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              Déjà inscrit ? Se connecter
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-8 py-4 font-bold text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Création en cours..."
                : "Créer mon entreprise"}
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "tel"
    | "email"
    | "decimal"
    | "search"
    | "url";
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  inputMode,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-cyan-400">*</span>
        )}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
    </label>
  );
}