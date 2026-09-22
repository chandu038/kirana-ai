import { Link } from "react-router-dom";
import { BarChart3, Bot, Package, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
import StoreIllustration from "@/components/StoreIllustration";
import { getUser } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const features = [
  { icon: Package, title: "Live stock", text: "See what's available before you order." },
  { icon: Truck, title: "Order tracking", text: "Follow every order from placed to delivered." },
  { icon: Bot, title: "AI assistant", text: "Ask 'where is my order?' and get an instant answer." },
  { icon: BarChart3, title: "Owner dashboard", text: "Sales, low-stock alerts and order management." },
];
const steps = [
  { n: "1", title: "Browse the shop", text: "See all products and prices without an account." },
  { n: "2", title: "Log in to order", text: "Sign up with email or Google when you're ready." },
  { n: "3", title: "Track or just ask", text: "Check the status or chat with the assistant." },
];
const customers = [
  "Browse products by category",
  "Place orders in a few clicks",
  "Track or cancel your orders",
  "Ask the assistant about orders and stock",
];
const owners = [
  "Manage products, prices and stock",
  "Get low-stock alerts",
  "Update order status as you pack and ship",
  "See sales and assistant usage on a dashboard",
];
const faqs = [
  { q: "Do I need an account?", a: "You can browse products without one. To place an order and use the assistant you need a free account." },
  { q: "Can I cancel an order?", a: "Yes, until it is shipped. Stock is returned to the shelf automatically." },
  { q: "Can the assistant see other people's orders?", a: "No. It only sees the orders of the account you're logged in with." },
  { q: "What can the assistant help with?", a: "Order status, product availability and prices. For anything else it will say it can't help." },
];

// everyone can open the shop; admins go to the products page instead
function CategoryLink({ name, children }) {
  const user = getUser();
  if (user?.role === "admin") {
    return <Link to="/admin/products" state={{ category: name }}>{children}</Link>;
  }
  return <Link to={`/shop?category=${encodeURIComponent(name)}`}>{children}</Link>;
}

export default function Landing() {
  const user = getUser();
  const btn = "w-full sm:w-auto";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:gap-10 md:py-20">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Your neighbourhood kirana, now with an AI assistant
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Order groceries, track every order and get instant answers, just by asking.
          </p>

          <div className={cn("grid gap-3 sm:flex", user && user.role !== "admin" ? "grid-cols-2" : "grid-cols-1")}>
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/shop"}
                  className={cn(buttonVariants({ size: "lg" }), btn)}
                >
                  {user.role === "admin" ? "Open dashboard" : "Go to shop"}
                </Link>
                {user.role !== "admin" && (
                  <Link to="/orders" className={cn(buttonVariants({ size: "lg", variant: "outline" }), btn)}>
                    My orders
                  </Link>
                )}
              </>
            ) : (
              <Link to="/signup" className={cn(buttonVariants({ size: "lg" }), btn)}>
                Get started
              </Link>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Questions? Tap the chat button at the bottom right.</p>
        </div>
        <StoreIllustration />
      </section>

      <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 md:pb-16">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Shop by category</h2>
        <p className="mb-6 text-center text-muted-foreground md:mb-8">Everything your kitchen and home need</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ name, icon: Icon, hint }) => (
            <CategoryLink key={name} name={name}>
              <Card className="group h-full transition hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-2 py-5 text-center md:py-6">
                  <Icon className="icon-wiggle h-7 w-7" />
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">{hint}</span>
                </CardContent>
              </Card>
            </CategoryLink>
          ))}
        </div>
      </section>

      <section id="features" className="scroll-mt-20 border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <h2 className="mb-6 text-center text-2xl font-bold md:mb-10 md:text-3xl">Everything your store needs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="float-slow mb-2 h-6 w-6" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-2 md:gap-6 md:py-16">
        {[
          { title: "For customers", items: customers },
          { title: "For store owners", items: owners },
        ].map(({ title, items }) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <h2 className="mb-6 text-center text-2xl font-bold md:mb-10 md:text-3xl">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-10 md:py-16">
        <h2 className="mb-6 text-center text-2xl font-bold md:mb-8 md:text-3xl">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="rounded-lg border px-4 py-3">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-16">
        <div className="rounded-xl bg-primary px-6 py-10 text-center text-primary-foreground md:py-12">
          <h2 className="text-xl font-bold md:text-2xl">Ready to shop smarter?</h2>
          <p className="mt-2 opacity-90">Create your free account and place your first order.</p>
          <div className="mt-6">
            <Link
              to={user ? (user.role === "admin" ? "/admin" : "/shop") : "/signup"}
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              {user ? "Continue" : "Create account"}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kirana AI
      </footer>

      <ChatWidget />
    </div>
  );
}