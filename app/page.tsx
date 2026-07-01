export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-400 mb-8">
          Accédez à votre espace OptiFlow AI.
        </p>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold">
            Se connecter
          </button>
        </div>
      </div>
    </main>
  );
}