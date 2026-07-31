import { getCurrentSession } from "../lib/auth/session";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const auth = await getCurrentSession();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4 lg:px-6">
      <div>
        <p className="text-sm text-slate-400">
          Voici le résumé intelligent de votre entreprise.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Ouvrir les notifications"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-lg transition hover:border-cyan-500/50 hover:bg-slate-700"
        >
          <span aria-hidden="true">●</span>
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
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Se connecter
          </a>
        )}
      </div>
    </header>
  );
}