"use client";

import {
  ChangeEvent,
  useMemo,
  useRef,
  useState,
} from "react";

type Analysis = {
  customer: string | null;
  address: string | null;
  reference: string | null;
  pallets: number | null;
  packages: number | null;
  weightKg: number | null;
  notes: string | null;
  confidence: number;
};

type Recipient = {
  name: string;
  carrierId: string | null;
  email: string | null;
  secondaryEmail: string | null;
  contactName: string | null;
};

type ScanResult = {
  success: boolean;
  workflow: "ALL_SOLUTIONS_PICKUP_REQUEST";
  recipient: Recipient;
  analysis: Analysis;
  missingRequiredFields: string[];
  requiresReview: boolean;
};

function Field({
  label,
  value,
  important = false,
}: {
  label: string;
  value: string | number | null;
  important?: boolean;
}) {
  const missing =
    value === null ||
    value === "";

  return (
    <div
      className={`rounded-xl border p-3 ${
        missing
          ? "border-amber-200 bg-amber-50"
          : important
            ? "border-cyan-200 bg-cyan-50"
            : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 font-bold ${
          missing
            ? "text-amber-700"
            : "text-slate-950"
        }`}
      >
        {missing
          ? "À compléter"
          : value}
      </p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  important = false,
  inputMode = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  important?: boolean;
  inputMode?: "text" | "numeric" | "decimal";
}) {
  const missing = !value.trim();

  return (
    <label
      className={`block rounded-xl border p-3 ${
        missing
          ? "border-amber-200 bg-amber-50"
          : important
            ? "border-cyan-200 bg-cyan-50"
            : "border-slate-200 bg-slate-50"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="À compléter"
        className={`mt-2 h-10 w-full rounded-lg border bg-white px-3 font-bold outline-none transition ${
          missing
            ? "border-amber-300 text-amber-800 focus:border-amber-500"
            : "border-slate-300 text-slate-950 focus:border-cyan-500"
        }`}
      />
    </label>
  );
}
export default function PickupScan() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<ScanResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showDraft, setShowDraft] =
    useState(false);

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const [editedCustomer, setEditedCustomer] =
    useState("");

  const [editedAddress, setEditedAddress] =
    useState("");

  const [editedReference, setEditedReference] =
    useState("");

  const [editedPallets, setEditedPallets] =
    useState("");

  const [editedPackages, setEditedPackages] =
    useState("");

  const [editedWeightKg, setEditedWeightKg] =
    useState("");

  const mailReady = useMemo(() => {
    return Boolean(
      editedReference.trim() &&
      editedPallets.trim() &&
      editedPackages.trim() &&
      editedWeightKg.trim(),
    );
  }, [
    editedReference,
    editedPallets,
    editedPackages,
    editedWeightKg,
  ]);

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setResult(null);
    setShowDraft(false);

    if (!file.type.startsWith("image/")) {
      setError(
        "Veuillez sélectionner une photo.",
      );
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/shipping/pickup-scan",
          {
            method: "POST",
            body: formData,
          },
        );

      const data =
        (await response.json()) as
          | ScanResult
          | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data
            ? data.error ||
                "Analyse impossible."
            : "Analyse impossible.",
        );
      }

      const scanResult =
        data as ScanResult;

      setResult(scanResult);

      setEditedCustomer(
        scanResult.analysis.customer ?? "",
      );

      setEditedAddress(
        scanResult.analysis.address ?? "",
      );

      setEditedReference(
        scanResult.analysis.reference ?? "",
      );

      setEditedPallets(
        scanResult.analysis.pallets === null
          ? ""
          : String(scanResult.analysis.pallets),
      );

      setEditedPackages(
        scanResult.analysis.packages === null
          ? ""
          : String(scanResult.analysis.packages),
      );

      setEditedWeightKg(
        scanResult.analysis.weightKg === null
          ? ""
          : String(scanResult.analysis.weightKg)
              .replace(".", ","),
      );
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "Impossible d'analyser le document.",
      );
    } finally {
      setLoading(false);
    }
  }

  function prepareMail() {
    if (!result) return;

    const generatedSubject =
      editedReference.trim()
        ? `Demande d'enlèvement - Réf. ${editedReference.trim()}`
        : "Demande d'enlèvement";

    const lines = [
      "Bonjour,",
      "",
      "Pouvez-vous organiser l'enlèvement suivant :",
      "",
      editedCustomer.trim()
        ? `Client : ${editedCustomer.trim()}`
        : null,
      editedAddress.trim()
        ? `Adresse : ${editedAddress.trim()}`
        : null,
      editedReference.trim()
        ? `Référence : ${editedReference.trim()}`
        : "Référence : À compléter",
      editedPallets.trim()
        ? `Nombre de palettes : ${editedPallets.trim()}`
        : "Nombre de palettes : À compléter",
      editedPackages.trim()
        ? `Nombre de colis : ${editedPackages.trim()}`
        : "Nombre de colis : À compléter",
      editedWeightKg.trim()
        ? `Poids total : ${editedWeightKg.trim()} kg`
        : "Poids total : À compléter",
      result.analysis.notes
        ? `Informations complémentaires : ${result.analysis.notes}`
        : null,
      "",
      "Merci de me confirmer la prise en charge de cette demande.",
      "",
      "Cordialement,",
    ].filter(
      (line): line is string =>
        line !== null,
    );

    setSubject(generatedSubject);
    setBody(lines.join("\n"));
    setShowDraft(true);
  }

  function reset() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setResult(null);
    setError("");
    setShowDraft(false);
    setSubject("");
    setBody("");

    setEditedCustomer("");
    setEditedAddress("");
    setEditedReference("");
    setEditedPallets("");
    setEditedPackages("");
    setEditedWeightKg("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">
            Organ·IA Vision
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Demande d'enlèvement ALL SOLUTIONS
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Photographiez votre feuille de demande.
            Organ·IA lit la référence, les palettes,
            les colis et le poids puis prépare le mail
            destiné à ALL SOLUTIONS.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={loading}
          className="min-h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Analyse en cours..."
            : "📷 Scanner la demande"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Demande photographiée
            </p>

            <img
              src={preview}
              alt="Demande d'enlèvement"
              className="max-h-[420px] w-full rounded-2xl border border-slate-200 object-contain"
            />
          </div>

          <div>
            {loading && (
              <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-cyan-300 bg-cyan-50">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />

                  <p className="mt-3 font-bold text-cyan-800">
                    Libot lit la demande…
                  </p>

                  <p className="mt-1 text-sm text-cyan-700">
                    Les informations absentes restent
                    à compléter.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Destinataire
                  </p>

                  <p className="mt-1 text-xl font-black text-slate-950">
                    ALL SOLUTIONS
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {result.recipient.email ??
                      "Adresse e-mail à configurer dans les transporteurs"}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${
                    result.requiresReview
                      ? "border-amber-200 bg-amber-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <p className="font-bold text-slate-950">
                    {result.requiresReview
                      ? "⚠️ Vérification nécessaire"
                      : "✓ Lecture complète"}
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    Confiance IA :{" "}
                    {Math.round(
                      result.analysis.confidence *
                        100,
                    )}
                    %
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <EditableField
                    label="Client"
                    value={editedCustomer}
                    onChange={setEditedCustomer}
                  />

                  <EditableField
                    label="Adresse"
                    value={editedAddress}
                    onChange={setEditedAddress}
                  />

                  <EditableField
                    label="Référence"
                    value={editedReference}
                    onChange={setEditedReference}
                    important
                  />

                  <EditableField
                    label="Palettes"
                    value={editedPallets}
                    onChange={setEditedPallets}
                    inputMode="numeric"
                    important
                  />

                  <EditableField
                    label="Colis"
                    value={editedPackages}
                    onChange={setEditedPackages}
                    inputMode="numeric"
                    important
                  />

                  <EditableField
                    label="Poids (kg)"
                    value={editedWeightKg}
                    onChange={setEditedWeightKg}
                    inputMode="decimal"
                    important
                  />
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="font-bold text-blue-900">
                    Contrôle humain avant génération
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    Corrigez directement une valeur si la lecture IA est incorrecte.
                    Le brouillon utilisera uniquement les valeurs affichées ici.
                  </p>
                </div>

                {result.analysis.notes && (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Informations complémentaires
                    </p>

                    <p className="mt-2 text-sm text-slate-800">
                      {result.analysis.notes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={prepareMail}
                    className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
                  >
                    ✉️ Préparer le mail à ALL SOLUTIONS
                  </button>

                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                  >
                    Refaire le scan
                  </button>
                </div>

                {!mailReady && (
                  <p className="text-sm font-semibold text-amber-700">
                    Certaines données obligatoires sont
                    manquantes. Le brouillon peut être
                    préparé, mais il doit être complété
                    avant envoi.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showDraft && result && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">
                Brouillon
              </p>

              <h3 className="text-xl font-black text-slate-950">
                Mail ALL SOLUTIONS
              </h3>
            </div>

            <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Validation humaine obligatoire
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                À
              </span>

              <input
                value={
                  result.recipient.email ??
                  ""
                }
                readOnly
                placeholder="Adresse ALL SOLUTIONS à configurer"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Objet
              </span>

              <input
                value={subject}
                onChange={(event) =>
                  setSubject(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              </span>

              <textarea
                value={body}
                onChange={(event) =>
                  setBody(
                    event.target.value,
                  )
                }
                rows={14}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              title="L'envoi réel sera connecté à la messagerie professionnelle"
              className="rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white opacity-50"
            >
              Envoyer après validation
            </button>

            <button
              type="button"
              onClick={() =>
                setShowDraft(false)
              }
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
            >
              Fermer le brouillon
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Aucun mail n'est envoyé à cette étape.
            L'envoi réel sera activé uniquement avec
            la messagerie professionnelle connectée.
          </p>
        </div>
      )}
    </section>
  );
}
