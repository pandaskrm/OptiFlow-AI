"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type UserMenuProps = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string;
};

function formatRole(role: string) {
  const roles: Record<string, string> = {
    OWNER: "Propriétaire",
    ADMIN: "Administrateur",
    MANAGER: "Responsable",
    OPERATOR: "Opérateur",
  };

  return roles[role] ?? role;
}

export default function UserMenu({
  firstName,
  lastName,
  email,
  role,
  companyName,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("La déconnexion a échoué.");
      }

      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
      alert("Impossible de vous déconnecter. Veuillez réessayer.");
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-left transition hover:border-cyan-500/50 hover:bg-slate-700"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-300">
          {initials}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-800 bg-emerald-400" />
        </span>

        <span className="hidden sm:block">
          <span className="block text-sm font-semibold text-white">
            {firstName} {lastName}
          </span>
          <span className="block text-xs text-slate-400">
            {formatRole(role)}
          </span>
        </span>

        <span
          className={`text-xs text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40"
        >
          <div className="border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15 font-bold text-cyan-300">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {firstName} {lastName}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {email}
                </p>
                <p className="mt-1 truncate text-xs text-cyan-300">
                  {companyName} · {formatRole(role)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <MenuLink
              href="/parametres#profil"
              title="Mon profil"
              description="Informations personnelles et sécurité"
            />

            <MenuLink
              href="/parametres#entreprise"
              title="Mon entreprise"
              description="Coordonnées et organisation"
            />

            <MenuLink
              href="/parametres#langue"
              title="Langue"
              description="Français et préférences régionales"
            />

            <MenuLink
              href="/parametres"
              title="Paramètres"
              description="Configuration générale d’OptiFlow AI"
            />

            <MenuLink
              href="/parametres#notifications"
              title="Notifications"
              description="Alertes et préférences"
            />

            <MenuLink
              href="/ai"
              title="Centre d’aide"
              description="Documentation et assistance IA"
            />
          </div>

          <div className="border-t border-slate-800 p-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-60"
            >
              <span className="block text-sm font-semibold text-red-400">
                {loggingOut ? "Déconnexion..." : "Se déconnecter"}
              </span>
              <span className="block text-xs text-slate-500">
                Fermer votre session en toute sécurité
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block rounded-xl px-3 py-2.5 transition hover:bg-slate-800"
    >
      <span className="block text-sm font-medium text-slate-100">
        {title}
      </span>
      <span className="block text-xs text-slate-500">
        {description}
      </span>
    </Link>
  );
}