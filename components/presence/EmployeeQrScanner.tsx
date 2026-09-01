"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type PunchResponse = {
  success?: boolean;

  punch?: {
    id: string;
    type: string;
    punchedAt: string;
    source: string;
  };

  error?: string;
};

type ScannerInstance = {
  start: (
    cameraConfig: unknown,
    configuration: unknown,
    onSuccess: (
      decodedText: string,
    ) => void,
    onFailure: (
      errorMessage: string,
    ) => void,
  ) => Promise<unknown>;

  stop: () => Promise<void>;

  clear: () => void;
};

type Props = {
  onPunchRecorded?: () => void;
};

const READER_ID =
  "organia-employee-qr-reader";

function formatPunchTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(value),
  );
}

function extractToken(
  scannedValue: string,
) {
  const value =
    scannedValue.trim();

  if (!value) {
    return "";
  }

  /*
   * Current OrganIA QR codes may contain the raw opaque token.
   *
   * Supporting a URL with ?token= as well keeps the scanner
   * compatible with a future printable/deep-link QR format.
   */
  try {
    const url =
      new URL(value);

    const token =
      url.searchParams.get(
        "token",
      );

    if (token) {
      return token.trim();
    }
  }
  catch {
    // Raw token: expected for the current Presence QR format.
  }

  return value;
}

export default function EmployeeQrScanner({
  onPunchRecorded,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const scannerRef =
    useRef<ScannerInstance | null>(
      null,
    );

  const processingRef =
    useRef(false);

  const stopScanner =
    useCallback(async () => {
      const scanner =
        scannerRef.current;

      scannerRef.current = null;

      if (!scanner) {
        return;
      }

      try {
        await scanner.stop();
      }
      catch {
        // Scanner may already be stopped.
      }

      try {
        scanner.clear();
      }
      catch {
        // Reader DOM may already be removed.
      }
    }, []);

  const closeScanner =
    useCallback(async () => {
      await stopScanner();

      processingRef.current =
        false;

      setProcessing(false);
      setStarting(false);
      setOpen(false);
    }, [stopScanner]);

  const submitPunch =
    useCallback(
      async (
        scannedValue: string,
      ) => {
        if (
          processingRef.current
        ) {
          return;
        }

        processingRef.current =
          true;

        setProcessing(true);
        setError(null);
        setSuccess(null);

        const token =
          extractToken(
            scannedValue,
          );

        if (!token) {
          setError(
            "Le QR scanne ne contient pas de jeton de presence valide.",
          );

          processingRef.current =
            false;

          setProcessing(false);

          return;
        }

        /*
         * Stop immediately after the first decoded QR to avoid
         * multiple requests from the same camera frame.
         */
        await stopScanner();

        try {
          const response =
            await fetch(
              "/api/presence/me/punch",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    token,
                  }),
              },
            );

          if (
            response.status === 401
          ) {
            window.location.href =
              "/login";

            return;
          }

          const result =
            (await response.json()) as PunchResponse;

          if (
            !response.ok ||
            !result.success ||
            !result.punch
          ) {
            throw new Error(
              result.error ??
                "Impossible d'enregistrer ce pointage.",
            );
          }

          const label =
            result.punch.type ===
            "IN"
              ? "Arrivee"
              : "Depart";

          setSuccess(
            `${label} enregistre a ${formatPunchTime(
              result.punch.punchedAt,
            )}.`,
          );

          onPunchRecorded?.();
        }
        catch (punchError) {
          setError(
            punchError instanceof Error
              ? punchError.message
              : "Impossible d'enregistrer ce pointage.",
          );
        }
        finally {
          processingRef.current =
            false;

          setProcessing(false);
        }
      },
      [
        onPunchRecorded,
        stopScanner,
      ],
    );

  const startScanner =
    useCallback(async () => {
      setOpen(true);
      setStarting(true);
      setProcessing(false);
      setError(null);
      setSuccess(null);

      processingRef.current =
        false;

      try {
        if (
          !window.isSecureContext
        ) {
          throw new Error(
            "La camera necessite une connexion securisee HTTPS.",
          );
        }

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices
            .getUserMedia
        ) {
          throw new Error(
            "La camera n'est pas disponible sur ce navigateur.",
          );
        }

        /*
         * Wait until the modal reader element exists in the DOM.
         */
        await new Promise<void>(
          (resolve) => {
            window.requestAnimationFrame(
              () => resolve(),
            );
          },
        );

        const module =
          await import(
            "html5-qrcode"
          );

        const scanner =
          new module.Html5Qrcode(
            READER_ID,
            {
              formatsToSupport: [
                module
                  .Html5QrcodeSupportedFormats
                  .QR_CODE,
              ],

              verbose: false,
            },
          ) as ScannerInstance;

        scannerRef.current =
          scanner;

        await scanner.start(
          {
            facingMode:
              "environment",
          },

          {
            fps: 10,

            qrbox: {
              width: 240,
              height: 240,
            },

            aspectRatio: 1,
          },

          (decodedText) => {
            void submitPunch(
              decodedText,
            );
          },

          () => {
            /*
             * Normal scanning frames frequently contain no QR.
             * Do not surface those transient decoder errors.
             */
          },
        );
      }
      catch (scannerError) {
        await stopScanner();

        setError(
          scannerError instanceof Error
            ? scannerError.message
            : "Impossible d'ouvrir la camera.",
        );
      }
      finally {
        setStarting(false);
      }
    }, [
      stopScanner,
      submitPunch,
    ]);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          void startScanner();
        }}
        className="mt-5 flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
      >
        Scanner le QR de présence
      </button>

      {success && !open && (
        <div className="mt-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-200">
          {success}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                Organ•IA Présence
              </p>

              <h2 className="mt-1 text-lg font-black">
                Scanner le QR
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                void closeScanner();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-200"
            >
              Fermer
            </button>
          </div>

          <div className="flex flex-1 flex-col px-4 py-6">
            <p className="mb-5 text-center text-sm leading-6 text-slate-300">
              Placez le QR d'arrivée ou de départ dans le cadre.
            </p>

            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-cyan-400/30 bg-black p-2">
              <div
                id={READER_ID}
                className="min-h-[300px] overflow-hidden rounded-2xl"
              />
            </div>

            {starting && (
              <div className="mt-5 text-center text-sm font-bold text-cyan-300">
                Ouverture de la caméra...
              </div>
            )}

            {processing && (
              <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center text-sm font-bold text-cyan-200">
                QR détecté. Enregistrement du pointage...
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5 text-center">
                <p className="text-lg font-black text-cyan-200">
                  {success}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void closeScanner();
                  }}
                  className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950"
                >
                  Terminer
                </button>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="text-center text-sm font-bold text-red-200">
                  {error}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void closeScanner();
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-black"
                  >
                    Fermer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void startScanner();
                    }}
                    className="rounded-xl bg-cyan-400 px-3 py-3 text-xs font-black text-slate-950"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            <p className="mt-auto pt-6 text-center text-xs leading-5 text-slate-500">
              Organ•IA conserve l'heure réelle du scan. Le temps retenu est calculé ensuite selon votre planning.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
