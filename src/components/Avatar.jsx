import { cn } from "@/lib/utils";

const BG = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa", "#a5f3fc"];
const SKIN = ["#ffdbac", "#f8d5b8", "#f1c27d", "#e8b98d", "#c68642", "#8d5524"];
const HAIR = ["#1f1f1f", "#4a2c17", "#a0522d", "#d4a017", "#c0392b", "#6b7280"];
const SHIRT = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#ea580c", "#0891b2", "#db2777"];

// small seeded random generator: same seed, same face
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];

export default function UserAvatar({ seed, onClick, className }) {
  const r = rng(seed);
  const bg = pick(r, BG);
  const skin = pick(r, SKIN);
  const hair = pick(r, HAIR);
  const shirt = pick(r, SHIRT);
  const style = Math.floor(r() * 4); // 0 short, 1 long, 2 bun, 3 cap
  const glasses = r() > 0.65;
  const smile = r() > 0.3;

  const face = (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      <rect width="40" height="40" fill={bg} />
      {style === 1 && <path d="M10 20 C8 7 32 7 30 20 L31 31 L9 31 Z" fill={hair} />}
      <path d="M6 40 C6 31 13 28 20 28 C27 28 34 31 34 40 Z" fill={shirt} />
      <circle cx="20" cy="18" r="9" fill={skin} />
      {style === 0 && <path d="M11 17 C11 8 29 8 29 17 C26 13 14 13 11 17 Z" fill={hair} />}
      {style === 1 && <path d="M11 17 C12 9 28 9 29 17 C25 14 15 14 11 17 Z" fill={hair} />}
      {style === 2 && (
        <>
          <circle cx="20" cy="8.5" r="4" fill={hair} />
          <path d="M11 17 C11 9 29 9 29 17 C26 13 14 13 11 17 Z" fill={hair} />
        </>
      )}
      {style === 3 && (
        <>
          <path d="M11 16 C11 8 29 8 29 16 Z" fill={shirt} />
          <rect x="10" y="15" width="20" height="2.5" rx="1.2" fill={shirt} />
        </>
      )}
      <circle cx="16.5" cy="18.5" r="1.1" fill="#1f2937" />
      <circle cx="23.5" cy="18.5" r="1.1" fill="#1f2937" />
      {glasses && (
        <g fill="none" stroke="#1f2937" strokeWidth="0.8">
          <circle cx="16.5" cy="18.5" r="2.6" />
          <circle cx="23.5" cy="18.5" r="2.6" />
          <path d="M19.1 18.5 h1.8" />
        </g>
      )}
      {smile ? (
        <path d="M16.5 22.5 Q20 25.8 23.5 22.5" fill="none" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />
      ) : (
        <path d="M17.5 23 h5" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />
      )}
    </svg>
  );

  const box = cn("block h-7 w-7 shrink-0 overflow-hidden rounded-full", className);
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label="Change avatar"
      className={cn(box, "transition hover:scale-110 hover:ring-2 hover:ring-primary/40")}
    >
      {face}
    </button>
  ) : (
    <span className={box}>{face}</span>
  );
}