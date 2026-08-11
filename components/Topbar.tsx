import { getCurrentSession } from "../lib/auth/session";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const auth = await getCurrentSession();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-organia-electric/15 bg-organia-night/80 px-5 py-4 lg:px-6">
      <div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-organia-electric-bright shadow-[0_0_12px_rgba(0,140,255,0.9)]"
          />

          <p className="text-sm font-medium text-slate-300">
            Intelligence logistique en temps r&eacute;el
          </p>
        </div>

        <p className="mt-1 text-xs text-organia-text-soft">
          Voici le r&eacute;sum&eacute; intelligent de votre entreprise.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Ouvrir les notifications"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-organia-electric/25 bg-organia-surface text-lg text-organia-cyan transition-all duration-200 hover:border-organia-electric-bright/60 hover:bg-organia-surface-soft hover:shadow-[0_0_18px_rgba(0,140,255,0.2)]"
        >
          <span aria-hidden="true">{"\u25CF"}</span>
        </button>

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
            className="rounded-xl bg-organia-electric px-4 py-2 font-semibold text-white shadow-[0_0_20px_rgba(0,107,255,0.25)] transition-all duration-200 hover:bg-organia-electric-bright hover:shadow-[0_0_26px_rgba(0,140,255,0.38)]"
          >
            Se connecter
          </a>
        )}
      </div>
    </header>
  );
}