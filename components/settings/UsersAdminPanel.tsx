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
  createdAt: string;
  lastLoginAt: string | null;
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  LOGISTICS_MANAGER: "Responsable logistique",
  TEAM_LEADER: "Chef d'équipe",
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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

      setSuccess(
        data.message ?? "Le collaborateur a été créé."
      );

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