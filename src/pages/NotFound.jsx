import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const ITEMS = [
  { e: "🍎", left: "6%", d: 11, delay: 0 },
  { e: "🥛", left: "17%", d: 14, delay: 3 },
  { e: "🍞", left: "30%", d: 12, delay: 6 },
  { e: "🧅", left: "44%", d: 15, delay: 1 },
  { e: "🍅", left: "58%", d: 10, delay: 4 },
  { e: "🧀", left: "70%", d: 13, delay: 7 },
  { e: "🥕", left: "82%", d: 12, delay: 2 },
  { e: "🍋", left: "92%", d: 16, delay: 5 },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <Navbar />

      {/* groceries drifting up the page */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {ITEMS.map((it) => (
          <span
            key={it.e}
            className="drift absolute -bottom-12 text-3xl sm:text-4xl"
            style={{ left: it.left, animationDuration: `${it.d}s`, animationDelay: `${it.delay}s` }}
          >
            {it.e}
          </span>
        ))}
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="flex items-center justify-center gap-2 font-display text-[6.5rem] font-bold leading-none sm:gap-4 sm:text-[10rem]">
          <span className="float-slow">4</span>
          <span
            className="float-slow flex h-20 w-20 items-center justify-center rounded-full border-[9px] border-primary sm:h-[7.5rem] sm:w-[7.5rem] sm:border-[12px]"
            style={{ animationDelay: "0.4s" }}
          >
            <ShoppingCart className="cart-rock h-8 w-8 sm:h-12 sm:w-12" />
          </span>
          <span className="float-slow" style={{ animationDelay: "0.8s" }}>4</span>
        </h1>

        <h2 className="mt-6 text-2xl font-bold md:text-3xl">Oops! This aisle is empty</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          We couldn't find the page you were looking for. It may have moved, or the link might be wrong.
        </p>

        <div className="mt-8 grid w-full max-w-xs grid-cols-2 gap-3 sm:flex sm:w-auto sm:max-w-none">
          <Button variant="outline" size="lg" className="gap-1" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
          <Link to="/" className={cn(buttonVariants({ size: "lg" }))}>
            Back to home
          </Link>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}