export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#060B1F] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          Connexion
        </h1>

        <p className="text-gray-400 mb-8">
          Connectez-vous à votre espace OptiFlow AI.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Adresse e-mail
            </label>

            <input
              type="email"
              placeholder="vous@entreprise.fr"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-bold"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}