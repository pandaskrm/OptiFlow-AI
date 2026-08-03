"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainLinks = [
  { href: "/dashboard", icon: "⌂", label: "Accueil" },
  { href: "/reception", icon: "↓", label: "Réception" },
  { href: "/preparation", icon: "□", label: "Préparation" },
  { href: "/shipping", icon: "→", label: "Expédition" },
];

const allLinks = [
  ...mainLinks,
  { href: "/stock", icon: "▦", label: "Stock" },
  { href: "/team", icon: "♟", label: "Équipe" },
  { href: "/executive", icon: "◇", label: "Direction" },
  { href: "/ai", icon: "✦", label: "IA OptiFlow" },
  { href: "/audit", icon: "≡", label: "Journal d’audit" },
  { href: "/parametres", icon: "⚙", label: "Paramètres" },
];

function isActive(pathname: string, href: string) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function MobileNavigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-xl lg:hidden">
        <div>
          <p className="text-lg font-black leading-none text-cyan-400">
            OptiFlow AI
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Warehouse Intelligence
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-2xl text-white"
        >
          ☰
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col border-r border-slate-700 bg-slate-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-cyan-400">
                  OptiFlow AI
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Menu principal
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xl text-white"
              >
                ×
              </button>
            </div>

            <nav className="mt-7 flex-1 space-y-2 overflow-y-auto pb-6">
              {allLinks.map((link) => {
                const active = isActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex min-h-12 items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-cyan-500 text-slate-950"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/40 text-lg">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <p className="text-xs font-bold text-cyan-300">
                OptiFlow AI V1.0
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Version candidate
              </p>
            </div>
          </aside>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-5 border-t border-slate-800 bg-slate-950/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {mainLinks.map((link) => {
          const active = isActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${
                active
                  ? "text-cyan-300"
                  : "text-slate-500"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${
                  active
                    ? "bg-cyan-500/15"
                    : "bg-transparent"
                }`}
              >
                {link.icon}
              </span>
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-slate-500"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-lg">
            •••
          </span>
          <span>Plus</span>
        </button>
      </nav>
    </>
  );
}
