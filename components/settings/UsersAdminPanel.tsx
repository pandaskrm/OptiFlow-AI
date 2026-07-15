"use client";

import { FormEvent, useEffect, useState } from "react";

type UserItem = {
  membershipId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  LOGISTICS_MANAGER: "Responsable logistique",
  TEAM_LEADER: "Chef d’équipe",
  OPERATOR: "Préparateur",
  READ_ONLY: "Lecture seule",
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "OPERATOR",
  temporaryPassword: "",
};

export default function UsersAdminPanel() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = (await response.json()) as {
        users?: UserItem[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de charger les collaborateurs."
        );
      }

      setUsers(data.users ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Impossible de créer le collaborateur."
        );
      }

      setSuccess(data.message ?? "Le collaborateur a été créé.");
      setForm(initialForm);
      setShowForm(false);

      await loadUsers();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-400">
            Collaborateurs
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Gestion des utilisateurs
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {users.length} collaborateur{users.length > 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
            setSuccess("");
          }}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
        >
          {showForm ? "Fermer" : "Ajouter un collaborateur"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-5 md:grid-cols-2"
        >
          <Field
            label="Prénom"
            value={form.firstName}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                firstName: value,
              }))
            }
          />

          <Field
            label="Nom"
            value={form.lastName}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                lastName: value,
              }))
            }
          />

          <Field
            label="Adresse e-mail"
            type="email"
            value={form.email}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                email: value,
              }))
            }
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Rôle
            </span>

            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none focus:border-cyan-500"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <Field
              label="Mot de passe temporaire"
              type="password"
              placeholder="10 caractères minimum"
              value={form.temporaryPassword}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  temporaryPassword: value,
                }))
              }
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-600 px-6 py-3 font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Création en cours..."
                : "Créer le collaborateur"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-slate-300">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">
                E-mail
              </th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">
                Rôle
              </th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">
                Dernière connexion
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Chargement des collaborateurs...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Aucun collaborateur.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.membershipId}
                  className="border-t border-slate-700"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="px-4 py-4 text-slate-300">
                    {user.email}
                  </td>

                  <td className="px-4 py-4 text-slate-300">
                    {roleLabels[user.role] ?? user.role}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {user.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {user.lastLoginAt
                      ? new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(user.lastLoginAt))
                      : "Jamais"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
      />
    </label>
  );
}