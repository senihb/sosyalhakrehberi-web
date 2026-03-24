type RiskBlockProps = {
  reasons: string[];
};

export function RiskBlock({ reasons }: RiskBlockProps) {
  if (reasons.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-950">
      <h3 className="text-xl font-semibold">
        Başvurunuz şu nedenlerle olumsuz görünebilir:
      </h3>
      <ul className="mt-4 space-y-3 text-sm leading-7">
        {reasons.map((reason) => (
          <li key={reason} className="rounded-2xl bg-white/70 p-4">
            {reason}
          </li>
        ))}
      </ul>
    </section>
  );
}
