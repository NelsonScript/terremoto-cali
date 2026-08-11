export default function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number | null;
  tone?: "critical" | "warning" | "ok" | "neutral";
}) {
  const toneClasses: Record<string, string> = {
    critical: "bg-red-50 border-red-300 text-red-900",
    warning: "bg-amber-50 border-amber-300 text-amber-900",
    ok: "bg-emerald-50 border-emerald-300 text-emerald-900",
    neutral: "bg-slate-50 border-slate-300 text-slate-900",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClasses[tone]}`}>
      <div className="text-2xl sm:text-3xl font-bold tabular-nums">
        {value ?? "—"}
      </div>
      <div className="text-xs sm:text-sm mt-1">{label}</div>
    </div>
  );
}
