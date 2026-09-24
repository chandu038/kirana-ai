import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// hover label on laptops; on phones it shows for a moment when you tap
export default function Tip({ label, children, side = "bottom", align = "center", className }) {
  const [tapped, setTapped] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function onPointerDown(e) {
    if (e.pointerType === "mouse") return; // a mouse uses hover
    setTapped(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setTapped(false), 1600);
  }

  return (
    <span className={cn("group/tip relative inline-flex", className)} onPointerDown={onPointerDown}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-60 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150",
          "group-hover/tip:opacity-100 group-hover/tip:delay-200",
          tapped && "opacity-100",
          side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
        )}
      >
        {label}
      </span>
    </span>
  );
}