"use client";

import {
  useMemo,
  useState,
} from "react";

import QRCode from "qrcode";

type QrType =
  | "ARRIVAL"
  | "DEPARTURE";

type GeneratedQr = {
  id: string;
  company: {
    id: string;
    name: string;
  };
  workDate: string;
  type: QrType;
  token: string;
  validFrom: string;
  validUntil: string;
};

function localDateKey(
  offsetDays = 0,
) {
  const date = new Date();

  date.setDate(
    date.getDate() +
      offsetDays,
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function frenchDate(
  value: string,
) {
  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(Number);

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(
      year,
      month - 1,
      day,
    ),
  );
}

export default function PresenceQrManager() {
  const today =
    useMemo(
      () => localDateKey(0),
      [],
    );

  const tomorrow =
    useMemo(
      () => localDateKey(1),
      [],
    );

  const [workDate, setWorkDate] =
    useState(today);

  const [type, setType] =
    useState<QrType>(
      "ARRIVAL",
    );

  const [qr, setQr] =
    useState<GeneratedQr | null>(
      null,
    );

  const [qrImage, setQrImage] =
    useState<string | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  async function generateQr() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/presence/qr",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              workDate,
              type,
            }),
          },
        );

      const payload =
        (await response.json()) as {
          qr?: GeneratedQr;
          error?: string;
        };

      if (
        !response.ok ||
        !payload.qr
      ) {
        throw new Error(
          payload.error ??
            "Generation impossible.",
        );
      }

      const image =
        await QRCode.toDataURL(
          payload.qr.token,
          {
            width: 520,
            margin: 2,
            errorCorrectionLevel:
              "M",
          },
        );

      setQr(payload.qr);
      setQrImage(image);
    }
    catch (caught) {
      setQr(null);
      setQrImage(null);

      setError(
        caught instanceof Error
          ? caught.message
          : "Impossible de generer le QR.",
      );
    }
    finally {
      setLoading(false);
    }
  }

  function changeDate(
    value: string,
  ) {
    setWorkDate(value);
    setQr(null);
    setQrImage(null);
    setError(null);
  }

  function changeType(
    value: QrType,
  ) {
    setType(value);
    setQr(null);
    setQrImage(null);
    setError(null);
  }

  function printQr() {
    if (
      !qr ||
      !qrImage
    ) {
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1000",
      );

    if (!printWindow) {
      setError(
        "La fenetre d'impression a ete bloquee par le navigateur.",
      );
      return;
    }

    const typeLabel =
      qr.type === "ARRIVAL"
        ? "ARRIVEE"
        : "DEPART";

    printWindow.document.write(`
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>OrganIA Presence - ${typeLabel}</title>
<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 32px;
    font-family: Arial, sans-serif;
    color: #0f172a;
    background: white;
  }

  .sheet {
    width: 100%;
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card {
    width: 680px;
    border: 3px solid #0f172a;
    border-radius: 24px;
    padding: 36px;
    text-align: center;
  }

  .brand {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  h1 {
    margin: 20px 0 8px;
    font-size: 48px;
  }

  .company {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }

  .date {
    margin: 10px 0 24px;
    font-size: 20px;
  }

  img {
    width: 460px;
    height: 460px;
    max-width: 100%;
  }

  .instruction {
    margin-top: 22px;
    font-size: 20px;
    font-weight: 700;
  }

  .footer {
    margin-top: 18px;
    font-size: 13px;
    color: #64748b;
  }

  @media print {
    body {
      padding: 0;
    }

    .sheet {
      min-height: 100vh;
    }
  }
</style>
</head>

<body>
<div class="sheet">
  <div class="card">
    <div class="brand">
      OrganIA Presence
    </div>

    <h1>
      ${typeLabel}
    </h1>

    <p class="company">
      ${qr.company.name}
    </p>

    <p class="date">
      ${frenchDate(qr.workDate)}
    </p>

    <img
      src="${qrImage}"
      alt="QR OrganIA Presence"
    />

    <p class="instruction">
      Scannez avec OrganIA Salarie
    </p>

    <p class="footer">
      QR valable uniquement pour cette date et ce type de pointage.
    </p>
  </div>
</div>

<script>
  window.onload = function () {
    window.print();
  };
</script>
</body>
</html>
    `);

    printWindow.document.close();
  }

  const generatedMatchesSelection =
    qr?.workDate === workDate &&
    qr?.type === type;

  return (
    <section className="mt-4 rounded-2xl border border-cyan-400/20 bg-slate-950 p-4 text-white shadow-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Pointage quotidien
          </p>

          <h3 className="mt-2 text-xl font-bold">
            QR OrganIA Presence
          </h3>

          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Generez le QR d'arrivee ou de depart pour aujourd'hui ou demain.
            Une regeneration invalide automatiquement l'ancien QR correspondant.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
          Le QR de demain peut etre imprime la veille,
          mais il ne devient utilisable qu'a sa date.
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Date
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                changeDate(today)
              }
              className={`rounded-xl px-4 py-3 text-left transition ${
                workDate === today
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-xs font-bold uppercase">
                Aujourd'hui
              </span>

              <span className="mt-1 block text-sm font-semibold">
                {frenchDate(today)}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                changeDate(tomorrow)
              }
              className={`rounded-xl px-4 py-3 text-left transition ${
                workDate === tomorrow
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-xs font-bold uppercase">
                Demain
              </span>

              <span className="mt-1 block text-sm font-semibold">
                {frenchDate(tomorrow)}
              </span>
            </button>
          </div>

          <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
            Type de QR
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                changeType(
                  "ARRIVAL",
                )
              }
              className={`rounded-xl px-4 py-4 text-left transition ${
                type === "ARRIVAL"
                  ? "border border-cyan-300 bg-cyan-400/15 text-cyan-100"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="block text-base font-black">
                ARRIVEE
              </span>

              <span className="mt-1 block text-xs opacity-70">
                Pointage du matin
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                changeType(
                  "DEPARTURE",
                )
              }
              className={`rounded-xl px-4 py-4 text-left transition ${
                type === "DEPARTURE"
                  ? "border border-cyan-300 bg-cyan-400/15 text-cyan-100"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="block text-base font-black">
                DEPART
              </span>

              <span className="mt-1 block text-xs opacity-70">
                Pointage du soir
              </span>
            </button>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              void generateQr()
            }
            className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-50"
          >
            {loading
              ? "Generation..."
              : qr &&
                  generatedMatchesSelection
                ? "Regenerer ce QR"
                : "Generer le QR"}
          </button>

          {error && (
            <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold">
              Fonctionnement
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Le salarie scanne ce QR depuis son espace OrganIA.
              Le serveur controle son compte, la date du QR,
              son planning et le type de pointage avant d'enregistrer
              l'heure brute.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950">
          {!qr ||
          !qrImage ||
          !generatedMatchesSelection ? (
            <div className="flex min-h-[390px] items-center justify-center text-center">
              <div>
                <p className="font-bold">
                  QR non genere
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Choisissez la date et le type,
                  puis generez le QR.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
                OrganIA Presence
              </p>

              <h4 className="mt-2 text-2xl font-black">
                {qr.type ===
                "ARRIVAL"
                  ? "ARRIVEE"
                  : "DEPART"}
              </h4>

              <p className="mt-1 text-sm font-bold text-slate-700">
                {qr.company.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {frenchDate(
                  qr.workDate,
                )}
              </p>

              <img
                src={qrImage}
                alt="QR OrganIA Presence"
                className="mx-auto mt-4 w-full max-w-[300px]"
              />

              <button
                type="button"
                onClick={printQr}
                className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Imprimer ce QR
              </button>

              <p className="mt-3 text-xs text-slate-400">
                Le token de securite n'est jamais affiche en clair.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
