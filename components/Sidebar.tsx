"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "📊 Dashboard" },
  { href: "/reception", label: "📥 Réception" },
  { href: "/preparation", label: "📋 Préparation" },
  { href: "/expedition", label: "🚚 Expédition" },
  { href: "/stock", label: "📦 Stock" },
  { href: "/equipe", label: "👥 Équipe" },
  { href: "/ia", label: "🤖 IA OptiFlow" },
  { href: "/parametres", label: "⚙️ Paramètres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "block bg-blue-600 rounded-xl px-4 py-3 font-semibold text-white"
      : "block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition";

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-10">
        OptiFlow AI
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClass(link.href)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}