import { ShoppingBasket } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2 font-display text-base font-semibold md:text-lg ${className}`}>
      <span className="logo-anim flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground md:h-8 md:w-8">
        <ShoppingBasket className="h-4 w-4" />
      </span>
      Kirana AI
    </span>
  );
}