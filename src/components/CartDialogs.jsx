import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthDialog from "@/components/AuthDialog";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/context/cart-context";
import { inr } from "@/lib/format";

export default function CartDialogs() {
  const navigate = useNavigate();
  const {
    open,
    setOpen,
    placed,
    setPlaced,
    authOpen,
    setAuthOpen,
    placeOrder,
  } = useCart();

  // guest logged in from the cart: place the order, then show their orders
  async function afterLogin(user) {
    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }
    const ok = await placeOrder();
    if (ok) navigate("/orders");
    else setOpen(true); // e.g. not enough stock: back to the cart to fix it
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your cart</DialogTitle>
            <DialogDescription>
              Review your items before placing the order.
            </DialogDescription>
          </DialogHeader>
          <CartPanel />
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        reason="Log in or sign up to place your order. Your cart is saved."
        onLoggedIn={afterLogin}
      />

      <Dialog
        open={Boolean(placed)}
        onOpenChange={(o) => !o && setPlaced(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" /> Order placed!
            </DialogTitle>
            <DialogDescription>
              Thank you. We'll start packing your order.
            </DialogDescription>
          </DialogHeader>
          {placed && (
            <div className="space-y-2 text-sm">
              {placed.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span className="text-muted-foreground">
                    {inr(i.price * i.qty)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{inr(placed.total)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlaced(null)}>
              Continue shopping
            </Button>
            <Button
              onClick={() => {
                setPlaced(null);
                navigate("/orders");
              }}
            >
              View my orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
