"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    icon: "📊",
    label: "Dashboard",
  },
  {
    href: "/reception",
    icon: "📥",
    label: "Réception",
  },
  {
    href: "/preparation",
    icon: "📦",
    label: "Préparation",
  },
  {
    href: "/shipping",
    icon: "🚚",
    label: "Expédition",
  },
  {
    href: "/executive",
    icon: "👔",
    label: "Direction",
  },
  {
    href: "/stock",
    icon: "📦",
    label: "Stock",
  },
  {
    href: "/equipe",
    icon: "👥",
    label: "Équipe",
  },
  {
    href: "/ia",
    icon: "🤖",
    label: "IA OptiFlow",
  },
  {
    href: "/parametres",
    icon: "⚙️",
    label: "Paramètres",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen border-r border-slate-800 bg-slate-950 p-6 text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-cyan-400">
          OptiFlow AI
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Warehouse Intelligence Platform
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-cyan-500 font-semibold text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <p className="text-sm font-semibold text-cyan-300">
          Version
        </p>

        <p className="mt-1 text-2xl font-bold">
          V1.0
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Développement en cours
        </p>
      </div>
    </aside>
  );
}