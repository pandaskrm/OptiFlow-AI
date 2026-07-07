"use client";

import useDemo from "../../hooks/useDemo";

export default function FloatingNotification() {
  const demo = useDemo();

  if (!demo.running) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="w-80 rounded-2xl border border-cyan-500/30 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-bold text-cyan-300">
            🔔 Notification
          </span>

          <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
            LIVE
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">
          {demo.event.title}
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          {demo.event.message}
        </p>
      </div>
    </div>
  );
}