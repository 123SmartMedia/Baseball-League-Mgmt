import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          "disabled:opacity-50",
          error && "border-red-400 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
