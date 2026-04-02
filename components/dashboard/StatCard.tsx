interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
