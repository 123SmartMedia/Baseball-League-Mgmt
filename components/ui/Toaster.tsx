"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ToastEventDetail, ToastType } from "@/lib/toast";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    function handler(e: Event) {
      const { message, type } = (e as CustomEvent<ToastEventDetail>).detail;
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        4000
      );
    }
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex min-w-[280px] max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl animate-in slide-in-from-bottom-2",
            t.type === "success" && "bg-green-500 text-white",
            t.type === "error"   && "bg-red-500 text-white",
            t.type === "info"    && "bg-[hsl(var(--primary))] text-white"
          )}
        >
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="mt-0.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
