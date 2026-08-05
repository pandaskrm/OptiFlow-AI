"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Carrier = {
  id: string;
  name: string;
  code: string | null;
  contactName: string | null;
  email: string | null;
  secondaryEmail: string | null;
  phone: string | null;
  averageLeadTimeHours: number | null;
  notes: string | null;
  supportsPallet: boolean;
  supportsParcel: boolean;
  supportsExpress: boolean;
  supportsNational: boolean;
  supportsInternational: boolean;
  isActive: boolean;
};

type CarrierResponse = {
  carriers?: Carrier[];
  carrier?: Carrier;
  success?: boolean;
  error?: string;
};

type CarrierForm = {
  name: string;
  code: string;
  contactName: string;
  email: string;
  secondaryEmail: string;
  phone: string;
  averageLeadTimeHours: string;
  notes: string;
  supportsPallet: boolean;
  supportsParcel: boolean;
  supportsExpress: boolean;
  supportsNational: boolean;
  supportsInternational: boolean;
  isActive: boolean;
};

const emptyForm: CarrierForm = {
  name: "",
  code: "",
  contactName: "",
  email: "",
  secondaryEmail: "",
  phone: "",
  averageLeadTimeHours: "24",
  notes: "",
  supportsPallet: true,
  supportsParcel: false,
  supportsExpress: false,
  supportsNational: true,
  supportsInternational: false,
  isActive: true,
};

export default function CarrierAdminPanel() {
  const [carriers, setCarriers] =
    useState<Carrier[]>([]);

  const [form, setForm] =
    useState<CarrierForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [isError, setIsError] =
    useState(false);

  const activeCarriers = useMemo(
    () =>
      carriers.filter(
        (carrier) => carrier.isActive,
      ).length,
    [carriers],
  );

  useEffect(() => {
    void loadCarriers();
  }, []);

  async function loadCarriers() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/carriers",
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as CarrierResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Chargement des transporteurs impossible.",
        );
      }

      setCarriers(data.carriers ?? []);
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Chargement impossible.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof CarrierForm>(
    field: K,
    value: CarrierForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(carrier: Carrier) {
    setEditingId(carrier.id);

    setForm({
      name: carrier.name,
      code: carrier.code ?? "",
      contactName:
        carrier.contactName ?? "",
      email: carrier.email ?? "",
      secondaryEmail:
        carrier.secondaryEmail ?? "",
      phone: carrier.phone ?? "",
      averageLeadTimeHours:
        carrier.averageLeadTimeHours === null
          ? ""
          : String(
              carrier.averageLeadTimeHours,
            ),
      notes: carrier.notes ?? "",
      supportsPallet:
        carrier.supportsPallet,
      supportsParcel:
        carrier.supportsParcel,
      supportsExpress:
        carrier.supportsExpress,
      supportsNational:
        carrier.supportsNational,
      supportsInternational:
        carrier.supportsInternational,
      isActive: carrier.isActive,
    });

    setFeedback("");
    setIsError(false);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submitCarrier(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        editingId
          ? `/api/admin/carriers/${editingId}`
          : "/api/admin/carriers",
        {
          method: editingId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            averageLeadTimeHours:
              form.averageLeadTimeHours
                ? Number(
                    form.averageLeadTimeHours,
                  )
                : null,
          }),
        },
      );

      const data =
        (await response.json()) as CarrierResponse;

      if (!response.ok || !data.carrier) {
        throw new Error(
          data.error ??
            "Enregistrement impossible.",
        );
      }

      const savedCarrier = data.carrier;

      setCarriers((current) => {
        if (editingId) {
          return current
            .map((carrier) =>
              carrier.id === savedCarrier.id
                ? savedCarrier
                : carrier,
            )
            .sort((left, right) =>
              left.name.localeCompare(
                right.name,
                "fr",
              ),
            );
        }

        return [...current, savedCarrier].sort(
          (left, right) =>
            left.name.localeCompare(
              right.name,
              "fr",
            ),
        );
      });

      setFeedback(
        editingId
          ? "Transporteur mis à jour."
          : "Transporteur ajouté.",
      );

      resetForm();
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Enregistrement impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCarrier(
    carrier: Carrier,
  ) {
    const confirmed = window.confirm(
      `Supprimer le transporteur ${carrier.name} ?`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        `/api/admin/carriers/${carrier.id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        (await response.json()) as CarrierResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Suppression impossible.",
        );
      }

      setCarriers((current) =>
        current.filter(
          (item) => item.id !== carrier.id,
        ),
      );

      if (editingId === carrier.id) {
        resetForm();
      }

      setFeedback(
        "Transporteur supprimé.",
      );
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Suppression impossible.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
            Référentiel métier
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Transporteurs
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Enregistrez les contacts qui recevront
            automatiquement les futures demandes
            d’enlèvement.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Actifs
          </p>

          <p className="mt-1 text-2xl font-black text-emerald-300">
            {activeCarriers}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={submitCarrier}
          className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4"
        >
          <h3 className="font-bold text-white">
            {editingId
              ? "Modifier le transporteur"
              : "Ajouter un transporteur"}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field
              label="Nom *"
              value={form.name}
              onChange={(value) =>
                updateField("name", value)
              }
              placeholder="All Solutions"
            />

            <Field
              label="Code interne"
              value={form.code}
              onChange={(value) =>
                updateField("code", value)
              }
              placeholder="ALLSOL"
            />

            <Field
              label="Contact principal"
              value={form.contactName}
              onChange={(value) =>
                updateField(
                  "contactName",
                  value,
                )
              }
              placeholder="Henri Carrasso"
            />

            <Field
              label="Téléphone"
              value={form.phone}
              onChange={(value) =>
                updateField("phone", value)
              }
              placeholder="04 00 00 00 00"
            />

            <Field
              label="E-mail principal"
              value={form.email}
              onChange={(value) =>
                updateField("email", value)
              }
              placeholder="contact@transporteur.fr"
              type="email"
            />

            <Field
              label="E-mail en copie"
              value={form.secondaryEmail}
              onChange={(value) =>
                updateField(
                  "secondaryEmail",
                  value,
                )
              }
              placeholder="exploitation@transporteur.fr"
              type="email"
            />

            <Field
              label="Délai moyen (heures)"
              value={
                form.averageLeadTimeHours
              }
              onChange={(value) =>
                updateField(
                  "averageLeadTimeHours",
                  value,
                )
              }
              placeholder="24"
              type="number"
            />

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Statut
              </span>

              <select
                value={
                  form.isActive
                    ? "ACTIVE"
                    : "INACTIVE"
                }
                onChange={(event) =>
                  updateField(
                    "isActive",
                    event.target.value ===
                      "ACTIVE",
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-cyan-500"
              >
                <option value="ACTIVE">
                  Actif
                </option>
                <option value="INACTIVE">
                  Inactif
                </option>
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <ServiceCheckbox
              label="Palettes"
              checked={
                form.supportsPallet
              }
              onChange={(checked) =>
                updateField(
                  "supportsPallet",
                  checked,
                )
              }
            />

            <ServiceCheckbox
              label="Colis / messagerie"
              checked={
                form.supportsParcel
              }
              onChange={(checked) =>
                updateField(
                  "supportsParcel",
                  checked,
                )
              }
            />

            <ServiceCheckbox
              label="Express"
              checked={
                form.supportsExpress
              }
              onChange={(checked) =>
                updateField(
                  "supportsExpress",
                  checked,
                )
              }
            />

            <ServiceCheckbox
              label="Transport national"
              checked={
                form.supportsNational
              }
              onChange={(checked) =>
                updateField(
                  "supportsNational",
                  checked,
                )
              }
            />

            <ServiceCheckbox
              label="Transport international"
              checked={
                form.supportsInternational
              }
              onChange={(checked) =>
                updateField(
                  "supportsInternational",
                  checked,
                )
              }
            />
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Notes
            </span>

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value,
                )
              }
              rows={3}
              placeholder="Créneaux, contraintes, consignes..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Mettre à jour"
                  : "Ajouter"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white">
              Carnet des transporteurs
            </h3>

            <span className="text-sm font-semibold text-slate-400">
              {carriers.length} enregistré
              {carriers.length > 1
                ? "s"
                : ""}
            </span>
          </div>

          {loading ? (
            <p className="mt-5 text-sm text-slate-400">
              Chargement...
            </p>
          ) : carriers.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-3xl">
                🚛
              </p>

              <p className="mt-3 font-semibold text-white">
                Aucun transporteur
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Ajoutez le premier contact
                transport.
              </p>
            </div>
          ) : (
            <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1">
              {carriers.map((carrier) => (
                <article
                  key={carrier.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white">
                          {carrier.name}
                        </h4>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                            carrier.isActive
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-slate-600 bg-slate-700 text-slate-300"
                          }`}
                        >
                          {carrier.isActive
                            ? "Actif"
                            : "Inactif"}
                        </span>
                      </div>

                      {carrier.contactName && (
                        <p className="mt-2 text-sm font-semibold text-slate-300">
                          {carrier.contactName}
                        </p>
                      )}

                      <p className="mt-1 break-all text-sm text-cyan-300">
                        {carrier.email ??
                          "E-mail non renseigné"}
                      </p>

                      {carrier.phone && (
                        <p className="mt-1 text-sm text-slate-400">
                          {carrier.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(carrier)
                        }
                        className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-500"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void deleteCarrier(
                            carrier,
                          )
                        }
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {carrier.supportsPallet && (
                      <ServiceBadge label="Palettes" />
                    )}

                    {carrier.supportsParcel && (
                      <ServiceBadge label="Colis" />
                    )}

                    {carrier.supportsExpress && (
                      <ServiceBadge label="Express" />
                    )}

                    {carrier.supportsNational && (
                      <ServiceBadge label="National" />
                    )}

                    {carrier.supportsInternational && (
                      <ServiceBadge label="International" />
                    )}
                  </div>

                  {carrier.averageLeadTimeHours !==
                    null && (
                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      Délai moyen :{" "}
                      {
                        carrier.averageLeadTimeHours
                      }{" "}
                      h
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            isError
              ? "border-red-500/20 bg-red-500/10 text-red-200"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {feedback}
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
      />
    </label>
  );
}

function ServiceCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm font-medium text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-cyan-500"
      />

      {label}
    </label>
  );
}

function ServiceBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
      {label}
    </span>
  );
}
