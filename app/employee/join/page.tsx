"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";

type Job = {
  id: string;
  code: string | null;
  name: string;
  service: string;
};

type ValidatedAccess = {
  access: {
    id: string;
    label: string;
    requiresApproval: boolean;
    population:
      | "TEMPORARY"
      | "EMPLOYEES";
    contractType: string | null;
    agency: string | null;
  };
  company: {
    id: string;
    name: string;
  };
  jobs: Job[];
  remainingUses: number | null;
};

type Step =
  | "CODE"
  | "PROFILE"
  | "SUCCESS";

function errorMessage(
  code?: string,
) {
  switch (code) {
    case "CODE_INVALID":
      return "Ce code d'accès est invalide.";

    case "CODE_EXPIRED":
      return "Ce code d'accès a expiré.";

    case "CODE_USAGE_LIMIT_REACHED":
      return "Ce code d'accès a atteint sa limite d'utilisation.";

    case "IDENTITY_INVALID":
      return "Vérifiez votre prénom et votre nom.";

    case "EMAIL_INVALID":
      return "L'adresse e-mail n'est pas valide.";

    case "EMAIL_ALREADY_USED":
      return "Un compte existe déjà avec cette adresse e-mail.";

    case "PASSWORD_INVALID":
      return "Le mot de passe doit contenir au moins 8 caractères.";

    case "JOB_REQUIRED":
    case "JOB_INVALID":
      return "Sélectionnez un métier valide.";

    case "CONFLICT":
      return "Ces informations sont déjà utilisées par un autre compte.";

    default:
      return "Une erreur est survenue. Réessayez.";
  }
}

export default function EmployeeJoinPage() {
  const router =
    useRouter();

  const [step, setStep] =
    useState<Step>("CODE");

  const [code, setCode] =
    useState("");

  const [access, setAccess] =
    useState<ValidatedAccess | null>(
      null,
    );

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [jobId, setJobId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [requiresApproval, setRequiresApproval] =
    useState(false);

  async function validateCode(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!code.trim()) {
      setError(
        "Saisissez votre code entreprise ou agence.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/presence/onboarding/validate-code",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              code,
            }),
          },
        );

      const payload =
        (await response.json()) as
          Partial<ValidatedAccess> & {
            error?: string;
          };

      if (
        !response.ok ||
        !payload.access ||
        !payload.company ||
        !payload.jobs
      ) {
        throw new Error(
          payload.error ??
            "CODE_INVALID",
        );
      }

      const validated =
        payload as ValidatedAccess;

      setAccess(validated);

      if (
        validated.jobs.length === 1
      ) {
        setJobId(
          validated.jobs[0].id,
        );
      }
      else {
        setJobId("");
      }

      setStep("PROFILE");
    }
    catch (caught) {
      setError(
        errorMessage(
          caught instanceof Error
            ? caught.message
            : undefined,
        ),
      );
    }
    finally {
      setLoading(false);
    }
  }

  async function registerEmployee(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!access) {
      setStep("CODE");
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError(
        "Renseignez votre prénom et votre nom.",
      );
      return;
    }

    if (!jobId) {
      setError(
        "Sélectionnez votre métier.",
      );
      return;
    }

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Renseignez votre e-mail et votre mot de passe.",
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Les mots de passe ne correspondent pas.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/presence/onboarding/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              code,
              firstName,
              lastName,
              email,
              password,
              phone,
              jobId,
            }),
          },
        );

      const payload =
        (await response.json()) as {
          success?: boolean;
          error?: string;
          requiresApproval?: boolean;
          next?: string;
        };

      if (
        !response.ok ||
        !payload.success
      ) {
        throw new Error(
          payload.error ??
            "REGISTER_FAILED",
        );
      }

      setRequiresApproval(
        Boolean(
          payload.requiresApproval,
        ),
      );

      setStep("SUCCESS");
    }
    catch (caught) {
      setError(
        errorMessage(
          caught instanceof Error
            ? caught.message
            : undefined,
        ),
      );
    }
    finally {
      setLoading(false);
    }
  }

  function restartCode() {
    setAccess(null);
    setJobId("");
    setError(null);
    setStep("CODE");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-black text-cyan-300">
            O
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
            Organ•IA Salarié
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Créer mon accès
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Rejoignez votre entreprise et accédez à votre planning,
            vos heures, vos statistiques et au pointage QR.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2">
          <div
            className={`h-1 rounded-full ${
              step === "CODE"
                ? "bg-cyan-400"
                : "bg-cyan-400"
            }`}
          />

          <div
            className={`h-1 rounded-full ${
              step === "PROFILE" ||
              step === "SUCCESS"
                ? "bg-cyan-400"
                : "bg-white/10"
            }`}
          />
        </div>

        {step === "CODE" && (
          <form
            onSubmit={validateCode}
            className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Étape 1
            </p>

            <h2 className="mt-2 text-xl font-black">
              Code entreprise ou agence
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Saisissez le code qui vous a été communiqué
              par votre entreprise ou votre agence d'intérim.
            </p>

            <label className="mt-6 block">
              <span className="text-sm font-bold">
                Code d'accès
              </span>

              <input
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                      .toUpperCase(),
                  )
                }
                autoCapitalize="characters"
                autoComplete="off"
                placeholder="Ex. ORGANIA-1234"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-4 text-center text-lg font-black uppercase tracking-[0.15em] text-white outline-none transition focus:border-cyan-400"
              />
            </label>

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-50"
            >
              {loading
                ? "Vérification..."
                : "Continuer"}
            </button>

            <Link
              href="/login"
              className="mt-4 block text-center text-sm text-slate-400 hover:text-white"
            >
              J'ai déjà un compte
            </Link>
          </form>
        )}

        {step === "PROFILE" &&
          access && (
            <form
              onSubmit={registerEmployee}
              className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl"
            >
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Entreprise reconnue
                </p>

                <p className="mt-1 text-lg font-black">
                  {access.company.name}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-slate-200">
                    {access.access.population ===
                    "TEMPORARY"
                      ? "Intérimaire"
                      : access.access.contractType ||
                        "Salarié"}
                  </span>

                  {access.access.agency && (
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-slate-200">
                      {access.access.agency}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={restartCode}
                className="mt-3 text-xs font-bold text-cyan-400"
              >
                Modifier le code
              </button>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Étape 2
              </p>

              <h2 className="mt-2 text-xl font-black">
                Votre profil
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <label>
                  <span className="text-xs font-bold text-slate-300">
                    Prénom
                  </span>

                  <input
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    autoComplete="given-name"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold text-slate-300">
                    Nom
                  </span>

                  <input
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                    autoComplete="family-name"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-slate-300">
                  Métier
                </span>

                <select
                  value={jobId}
                  onChange={(event) =>
                    setJobId(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">
                    Sélectionner mon métier
                  </option>

                  {access.jobs.map(
                    (job) => (
                      <option
                        key={job.id}
                        value={job.id}
                      >
                        {job.name}
                        {" — "}
                        {job.service}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-slate-300">
                  E-mail
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  autoComplete="email"
                  inputMode="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-slate-300">
                  Téléphone
                </span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value,
                    )
                  }
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Optionnel"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-slate-300">
                  Mot de passe
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-slate-300">
                  Confirmer le mot de passe
                </span>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>

              {error && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-50"
              >
                {loading
                  ? "Création..."
                  : "Créer mon accès Organ•IA"}
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                Votre entreprise, votre type de contrat et votre agence
                sont déterminés automatiquement par votre code d'accès.
              </p>
            </form>
          )}

        {step === "SUCCESS" && (
          <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-2xl font-black text-slate-950">
              ✓
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Accès créé
            </h2>

            {requiresApproval ? (
              <>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Votre inscription a bien été enregistrée.
                  Votre accès doit maintenant être validé
                  par un responsable.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/login",
                    )
                  }
                  className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-black hover:bg-white/10"
                >
                  Retour à la connexion
                </button>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Votre compte Organ•IA Salarié est prêt.
                  Connectez-vous pour accéder à votre espace.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/login",
                    )
                  }
                  className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 hover:bg-cyan-300"
                >
                  Me connecter
                </button>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-600">
          Organ•IA Flow · Présence
        </p>
      </div>
    </main>
  );
}
