import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, Menu, ShoppingCart, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import Tip from "@/components/Tip";
import { useCart } from "@/context/Cart-Context";
import { useChat } from "@/context/Chat-Context";
import { getUser, logout } from "@/lib/api";
import { cn } from "@/lib/utils";

const CONTACT = { action: "contact", label: "Contact us" };

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const cart = useCart();
  const chat = useChat();
  const [open, setOpen] = useState(false);
  const isCustomer = Boolean(user) && user.role !== "admin";
  const onLanding = location.pathname === "/";
  const close = () => setOpen(false);

  const links =
    user?.role === "admin"
      ? [
          { to: "/", label: "Home" },
          { to: "/admin", label: "Admin" },
        ]
      : user
        ? [{ to: "/", label: "Home" }, { to: "/shop", label: "Shop" }, CONTACT]
        : onLanding
          ? [
              { to: "/shop", label: "Shop" },
              { href: "#categories", label: "Categories" },
              { href: "#faq", label: "FAQ" },
              CONTACT,
            ]
          : [
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              CONTACT,
            ];

  function renderLink(l, mobile) {
    const cls = ({ isActive } = {}) =>
      cn(
        "rounded-md text-sm font-medium transition-colors hover:bg-muted",
        mobile ? "block px-3 py-2.5 text-base" : "px-3 py-2",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground",
      );
    if (l.action) {
      // "Contact us" opens the assistant window on its Contact tab
      return (
        <button
          key={l.action}
          type="button"
          className={cn(cls(), mobile && "w-full text-left")}
          onClick={() => {
            close();
            window.dispatchEvent(new Event("open-contact"));
          }}
        >
          {l.label}
        </button>
      );
    }
    return l.href ? (
      <a key={l.href} href={l.href} className={cls()} onClick={close}>
        {l.label}
      </a>
    ) : (
      <NavLink
        key={l.to}
        to={l.to}
        end={l.to === "/"}
        className={cls}
        onClick={close}
      >
        {l.label}
      </NavLink>
    );
  }

  function handleLogout() {
    logout();
    chat?.reset(); // clears the assistant conversation
    cart?.clear();
    close();
    navigate("/");
  }

  function actions(mobile) {
    const size = mobile ? "h-10 w-full" : "h-9 px-4";
    if (user) {
      return (
        <Button variant="outline" className={size} onClick={handleLogout}>
          Log out
        </Button>
      );
    }
    return (
      <>
        <Link
          to="/login"
          onClick={close}
          className={cn(buttonVariants({ variant: "outline" }), size)}
        >
          Log in
        </Link>
        <Link
          to="/signup"
          onClick={close}
          className={cn(buttonVariants(), size)}
        >
          Sign up
        </Link>
      </>
    );
  }

  // Orders: only for logged-in customers (it lives inside their account)
  const ordersLink = isCustomer && (
    <Tip label="My orders">
      <NavLink
        to="/orders"
        aria-label="My orders"
        className={({ isActive }) =>
          cn(
            buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              size: "sm",
            }),
            "h-9 gap-1.5 px-2 md:px-3",
          )
        }
      >
        <ClipboardList className="h-4 w-4" />
        <span className="hidden md:inline">Orders</span>
      </NavLink>
    </Tip>
  );

  // Cart: always for customers; for guests on the shop or once they added something
  const showCart =
    cart &&
    user?.role !== "admin" &&
    (Boolean(user) || location.pathname.startsWith("/shop") || cart.count > 0);

  const cartButton = showCart && (
    <Tip label={cart.count > 0 ? `Cart (${cart.count})` : "Cart"}>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 gap-1.5 px-2 md:px-3"
        aria-label="Open cart"
        onClick={() => cart.setOpen(true)}
      >
        <span className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cart.count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {cart.count}
            </span>
          )}
        </span>
        <span className="hidden md:inline">Cart</span>
      </Button>
    </Tip>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link to="/" className="shrink-0" onClick={close}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => renderLink(l, false))}
        </nav>

        <div className="flex items-center gap-1">
          {ordersLink}
          {cartButton}

          <div className="ml-1 hidden items-center gap-2 md:flex">
            {actions(false)}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <ModeToggle />
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-b bg-background shadow-md md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="flex flex-col">
              {links.map((l) => renderLink(l, true))}
            </nav>
            <div
              className={cn(
                "mt-3 grid gap-2 border-t pt-3",
                user ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {actions(true)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
