"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/reception", icon: "📥", label: "Réception" },
  { href: "/preparation", icon: "📦", label: "Préparation" },
  { href: "/shipping", icon: "🚚", label: "Expédition" },
  { href: "/executive", icon: "👔", label: "Direction" },
  { href: "/stock", icon: "📦", label: "Stock" },
  { href: "/team", icon: "👥", label: "Équipe" },
  { href: "/ai", icon: "🤖", label: "IA OptiFlow" },
  { href: "/audit", icon: "📜", label: "Journal d’audit" },
  { href: "/parametres", icon: "⚙️", label: "Paramètres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-60 shrink-0 border-r border-slate-800 bg-slate-950 px-4 py-5 text-white">
      <div className="mb-7">
        <h1 className="text-2xl font-black leading-tight text-cyan-400">
          OptiFlow AI
        </h1>

        <p className="mt-1.5 text-xs leading-5 text-slate-400">
          Warehouse Intelligence Platform
        </p>
      </div>

      <nav className="space-y-1.5">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-cyan-500 font-semibold text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
        <p className="text-xs font-semibold text-cyan-300">
          Version
        </p>

        <p className="mt-1 text-xl font-bold">V1.0</p>

        <p className="mt-1.5 text-xs text-slate-400">
          Version candidate
        </p>
      </div>
    </aside>
  );
}
