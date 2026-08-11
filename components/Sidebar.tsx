"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", icon: "\u{1F4CA}", label: "Dashboard" },
  { href: "/reception", icon: "\u{1F4E5}", label: "R\u00e9ception" },
  { href: "/reception/mail", icon: "\u{1F4E7}", label: "Bo\u00eete mail" },
  { href: "/preparation", icon: "\u{1F4E6}", label: "Pr\u00e9paration" },
  { href: "/shipping", icon: "\u{1F69A}", label: "Exp\u00e9dition" },
  { href: "/executive", icon: "\u{1F454}", label: "Direction" },
  { href: "/stock", icon: "\u{1F4E6}", label: "Stock" },
  { href: "/team", icon: "\u{1F465}", label: "\u00c9quipe" },
  { href: "/ai", icon: "\u{1F916}", label: "IA Organ\u2022IA" },
  { href: "/audit", icon: "\u{1F4DC}", label: "Journal d\u2019audit" },
  { href: "/parametres", icon: "\u2699\uFE0F", label: "Param\u00e8tres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-60 shrink-0 border-r border-organia-electric/20 bg-organia-night px-4 py-5 text-white lg:block">
      <div className="mb-7">
        <div className="organia-logo-electric flex items-center gap-2">
          <span
            aria-hidden="true"
            className="organia-logo-orb h-3 w-3 rounded-full bg-organia-cyan"
          />

          <h1 className="organia-logo-text text-2xl font-black leading-tight tracking-tight">
            Organ<span className="text-organia-electric-bright">&bull;IA</span>{" "}
            <span className="text-organia-cyan">Flow</span>
          </h1>
        </div>

        <p className="mt-2 text-xs font-medium tracking-wide text-organia-text-soft">
          Logistics Intelligence Platform
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
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? "border-organia-electric-bright/50 organia-nav-active organia-plasma-active bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00a8ff] font-semibold text-white"
                  : "border-transparent text-slate-300 hover:border-organia-electric/20 hover:bg-organia-surface-soft hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 rounded-xl border border-organia-electric/25 bg-organia-electric/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-organia-cyan">Organ&bull;IA Flow</p>

          <span className="h-2 w-2 rounded-full bg-organia-cyan shadow-[0_0_12px_rgba(0,229,255,0.85)]" />
        </div>

        <p className="mt-1 text-xl font-bold text-white">V1.0</p>

        <p className="mt-1.5 text-xs font-medium text-organia-text-soft">
          Version candidate
        </p>
      </div>
    </aside>
  );
}