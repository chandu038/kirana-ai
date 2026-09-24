import { NavLink, Outlet } from "react-router-dom";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
import Tip from "@/components/Tip";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin", label: "Overview", end: true, tip: "Sales, stock and assistant stats" },
  { to: "/admin/orders", label: "Orders", tip: "Manage orders and status" },
  { to: "/admin/products", label: "Products", tip: "Add and restock products" },
  { to: "/admin/users", label: "Users", tip: "Customers and their orders" },
  { to: "/admin/messages", label: "Messages", tip: "Messages from the Contact us form" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-4 grid grid-cols-5 gap-1 rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <Tip key={t.to} label={t.tip} className="flex w-full">
              <NavLink
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  cn(
                    "w-full whitespace-nowrap rounded-md px-0.5 py-1.5 text-center text-xs font-medium transition-colors sm:px-3 sm:text-sm",
                    isActive ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {t.label}
              </NavLink>
            </Tip>
          ))}
        </nav>
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
}