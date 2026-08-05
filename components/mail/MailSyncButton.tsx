"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SyncResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  result?: {
    imported: number;
    scanned: number;
    duplicates: number;
    ignored: number;
  };
};

export default function MailSyncButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const router = useRouter();

  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function synchronize() {
    setSyncing(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/mail/sync", {
        method: "POST",
      });

      const data =
        (await response.json()) as SyncResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Synchronisation impossible.",
        );
      }

      setMessage(
        data.message ?? "Synchronisation terminée.",
      );

      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Synchronisation impossible.",
      );
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={synchronize}
        disabled={disabled || syncing}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {syncing
          ? "Synchronisation..."
          : "Synchroniser maintenant"}
      </button>

      {message && (
        <p
          className={`max-w-sm text-right text-xs ${
            isError
              ? "text-red-300"
              : "text-emerald-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
