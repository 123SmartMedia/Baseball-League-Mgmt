import type { Rule } from "@/types";

interface LeagueRulesProps {
  rules: Rule[];
}

export function LeagueRules({ rules }: LeagueRulesProps) {
  if (rules.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No rules posted yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {rules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} />
      ))}
    </div>
  );
}

function RuleCard({ rule }: { rule: Rule }) {
  return (
    <div
      id={`rule-${rule.id}`}
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold">{rule.title}</h3>
        {rule.age_group && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {rule.age_group}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
    </div>
  );
}
