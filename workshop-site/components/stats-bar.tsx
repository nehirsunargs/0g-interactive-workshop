const STATS = [
  { value: "650M+", label: "Transactions on Testnet" },
  { value: "22M+", label: "Active Accounts" },
  { value: "8K+", label: "Testnet Validators" },
  { value: "11K+", label: "Peak TPS per Shard" },
];

export function StatsBar() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Top & bottom border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-border" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden="true" />

      {/* Subtle glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(146, 0, 225, 0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground font-mono tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
