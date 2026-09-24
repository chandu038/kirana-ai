const SHELVES = [
  ["#f59e0b", "#ef4444", "#3b82f6"],
  ["#22c55e", "#a855f7", "#f97316"],
];

function Window({ x }) {
  return (
    <g>
      <rect x={x} y="140" width="74" height="76" rx="6" className="fill-muted stroke-border" strokeWidth="2" />
      <line x1={x} x2={x + 74} y1="178" y2="178" className="stroke-border" strokeWidth="3" />
      {SHELVES.map((row, r) =>
        row.map((c, i) => (
          <rect key={`${r}-${i}`} x={x + 9 + i * 21} y={r === 0 ? 158 : 196} width="15" height="20" rx="2" fill={c} />
        ))
      )}
    </g>
  );
}

function Plant({ x }) {
  return (
    <g>
      <circle cx={x + 11} cy="222" r="14" fill="#22c55e" />
      <rect x={x} y="228" width="22" height="22" rx="3" fill="#b45309" />
    </g>
  );
}

export default function StoreIllustration() {
  return (
    <svg
      viewBox="0 0 400 280"
      role="img"
      aria-label="Illustration of a kirana store"
      className="w-full rounded-xl border bg-muted/40 shadow-lg"
    >
      <circle cx="352" cy="44" r="16" fill="#fbbf24" className="float-slow" />
      <rect x="0" y="250" width="400" height="30" className="fill-muted" />

      <rect x="60" y="90" width="280" height="160" rx="6" className="fill-card stroke-border" strokeWidth="2" />
      <rect x="56" y="84" width="288" height="10" rx="3" className="fill-primary" />

      <g className="sign-swing">
        <rect x="140" y="44" width="120" height="34" rx="8" fill="#16a34a" />
        <text x="200" y="67" textAnchor="middle" fontSize="20" fontWeight="700" fill="white" style={{ fontFamily: "var(--font-display)" }}>
          KIRANA
        </text>
      </g>

      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M${60 + i * 40} 94 h40 v20 a20 20 0 0 1 -40 0 z`}
          fill={i % 2 ? "#dcfce7" : "#16a34a"}
        />
      ))}

      <Window x={78} />
      <Window x={248} />

      <rect x="172" y="160" width="56" height="90" rx="4" className="fill-primary/20 stroke-border" strokeWidth="2" />
      <circle cx="218" cy="208" r="3" fill="#f59e0b" />

      <Plant x={30} />
      <Plant x={348} />
    </svg>
  );
}