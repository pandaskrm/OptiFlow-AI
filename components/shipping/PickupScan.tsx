"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

type Analysis = {
  carrier: string | null;
  pickupDate: string | null;
  pickupTime: string | null;
  pallets: number | null;
  packages: number | null;
  weightKg: number | null;
  reference: string | null;
  destination: string | null;
  notes: string | null;
  confidence: number;
};

type Carrier = {
  id: string;
  name: string;
  email: string | null;
  secondaryEmail: string | null;
  contactName: string | null;
};

type ScanResult = {
  success: boolean;
  analysis: Analysis;
  carrier: Carrier | null;
  requiresReview: boolean;
};

function Value({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  const missing =
    value === null ||
    value === "";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 font-bold ${
          missing
            ? "text-amber-600"
            : "text-slate-950"
        }`}
      >
        {missing ? "À compléter" : value}
      </p>
    </div>
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

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setResult(null);

    if (!file.type.startsWith("image/")) {
      setError(
        "Veuillez sélectionner une photo.",
      );
      return;
    }

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
    setLoading(true);

    try {
      const formData =
        new FormData();

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
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Analyse impossible.",
        );
      }

      setResult(
        data as ScanResult,
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

  function reset() {
    setPreview(null);
    setResult(null);
    setError("");

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
            Demande d'enlèvement
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Photographiez la feuille transporteur.
            Organ·IA extrait les informations et
            prépare les données avant création du mail.
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
            : "📷 Scanner une demande"}
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
              Document photographié
            </p>

            <img
              src={preview}
              alt="Demande d'enlèvement photographiée"
              className="max-h-[420px] w-full rounded-2xl border border-slate-200 object-contain"
            />
          </div>

          <div>
            {loading && (
              <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-cyan-300 bg-cyan-50">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />

                  <p className="mt-3 font-bold text-cyan-800">
                    Libot lit le document…
                  </p>

                  <p className="mt-1 text-sm text-cyan-700">
                    Aucune donnée ne sera inventée.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div
                  className={`rounded-2xl border p-4 ${
                    result.requiresReview
                      ? "border-amber-200 bg-amber-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <p className="font-bold text-slate-950">
                    {result.requiresReview
                      ? "⚠️ Contrôle nécessaire"
                      : "✓ Lecture terminée"}
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
                  <Value
                    label="Transporteur"
                    value={
                      result.carrier?.name ??
                      result.analysis.carrier
                    }
                  />

                  <Value
                    label="Date enlèvement"
                    value={
                      result.analysis.pickupDate
                    }
                  />

                  <Value
                    label="Heure"
                    value={
                      result.analysis.pickupTime
                    }
                  />

                  <Value
                    label="Palettes"
                    value={
                      result.analysis.pallets
                    }
                  />

                  <Value
                    label="Colis"
                    value={
                      result.analysis.packages
                    }
                  />

                  <Value
                    label="Poids"
                    value={
                      result.analysis.weightKg ===
                      null
                        ? null
                        : `${result.analysis.weightKg} kg`
                    }
                  />

                  <Value
                    label="Référence"
                    value={
                      result.analysis.reference
                    }
                  />

                  <Value
                    label="Destination"
                    value={
                      result.analysis.destination
                    }
                  />

                  <Value
                    label="E-mail transporteur"
                    value={
                      result.carrier?.email ??
                      null
                    }
                  />
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
                    disabled
                    title="Disponible à l'étape suivante"
                    className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white opacity-50"
                  >
                    Préparer le mail
                  </button>

                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                  >
                    Refaire le scan
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Le mail ne sera jamais envoyé sans
                  validation humaine.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
