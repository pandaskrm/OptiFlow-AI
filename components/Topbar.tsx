import { getCurrentSession } from "../lib/auth/session";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const auth = await getCurrentSession();

  return (
    <header className="relative flex h-[72px] items-center border-b border-[#008cff]/20 bg-[#010617]/95 px-5 lg:px-6">

      {/* Ligne lumineuse inférieure */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#008cff]/35 to-transparent" />

      <div className="flex w-full items-center gap-5">

        {/* IDENTITÉ / STATUS */}
        <div className="hidden min-w-[245px] xl:block">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00cfff] shadow-[0_0_12px_#00cfff]" />

            <p className="text-[12px] font-medium text-slate-300">
              Intelligence logistique en temps réel
            </p>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Voici le résumé intelligent de votre entreprise.
          </p>
        </div>

        {/* RECHERCHE */}
        <div className="flex flex-1 justify-center">
          <div className="group relative w-full max-w-[720px]">

            <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-[#006bff]/20 via-[#00e5ff]/25 to-[#006bff]/20 opacity-60 blur-[5px] transition group-focus-within:opacity-100" />

            <div className="relative flex h-[42px] items-center rounded-xl border border-[#008cff]/55 bg-[#031027]/95 shadow-[inset_0_0_18px_rgba(0,107,255,.06)] transition focus-within:border-[#00e5ff]/75 focus-within:shadow-[0_0_18px_rgba(0,229,255,.14)]">

              <span
                aria-hidden="true"
                className="ml-4 text-[20px] text-[#9ab5d8]"
              >
                ⌕
              </span>

              <input
                type="search"
                aria-label="Recherche globale"
                placeholder="Rechercher une commande, un article, un dock..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[12px] text-white outline-none placeholder:text-[#5d7191]"
              />

              <div className="mr-3 hidden items-center gap-1 rounded-md border border-[#008cff]/20 bg-[#020617]/70 px-2 py-1 text-[9px] font-bold text-slate-500 2xl:flex">
                CTRL
                <span className="text-[#00d9ff]">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-2">

          {/* COMMAND CENTER */}
          <button
            type="button"
            aria-label="Commandes rapides"
            className="hidden h-[42px] w-[42px] items-center justify-center rounded-xl border border-[#008cff]/25 bg-[#031027]/90 text-[#70a8dc] transition hover:border-[#00e5ff]/60 hover:text-[#00e5ff] hover:shadow-[0_0_18px_rgba(0,229,255,.18)] lg:flex"
          >
            <span className="text-[16px] font-black">
              {"<>"}
            </span>
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            aria-label="Ouvrir les notifications"
            className="relative flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-[#008cff]/25 bg-[#031027]/90 text-[18px] text-[#a8c6ec] transition hover:border-[#00e5ff]/60 hover:text-white hover:shadow-[0_0_18px_rgba(0,229,255,.18)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[19px] w-[19px] fill-none stroke-current"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-red-300/40 bg-red-500 px-1 text-[8px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,.75)]">
              3
            </span>
          </button>

          {/* MODE DEMO */}
          <a
            href="/demo"
            className="hidden h-[42px] items-center gap-2 rounded-xl border border-[#00e5ff]/80 bg-gradient-to-r from-[#003c68] via-[#005b82] to-[#00334f] px-5 text-[11px] font-black text-white shadow-[0_0_18px_rgba(0,229,255,.26),inset_0_0_22px_rgba(0,229,255,.08)] transition hover:border-[#65f6ff] hover:shadow-[0_0_28px_rgba(0,229,255,.42)] xl:flex"
          >
            <span className="text-[15px] text-[#00ffb3] drop-shadow-[0_0_7px_rgba(0,255,179,.8)]">
              ▶
            </span>

            Mode Démo

            <span className="ml-1 h-2 w-2 rounded-full bg-[#00ff9d] shadow-[0_0_9px_#00ff9d]" />
          </a>

          {/* PROFIL */}
          {auth ? (
            <UserMenu
              firstName={auth.user.firstName}
              lastName={auth.user.lastName}
              email={auth.user.email}
              role={auth.membership.role}
              companyName={auth.company.name}
            />
          ) : (
            <a
              href="/login"
              className="flex h-[42px] items-center rounded-xl border border-[#008cff]/45 bg-[#031027] px-4 text-[11px] font-bold text-white transition hover:border-[#00e5ff]/70"
            >
              Se connecter
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
