"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface FormModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function FormModal({
  title,
  open,
  onClose,
  children,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl",
          "animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0"
        )}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3>{title}</h3>
          <button
            onClick={onClose}
            className="tap-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Actions */}
        {onSubmit && (
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading} className="flex-1">
              {loading ? "Saving…" : submitLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
