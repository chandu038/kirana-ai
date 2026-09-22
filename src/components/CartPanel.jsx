import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tip from "@/components/Tip";
import { useCart } from "@/context/Cart-Context";
import { getUser } from "@/lib/api";
import { inr } from "@/lib/format";

export default function CartPanel() {
  const { items, changeQty, placeOrder, placing, total } = useCart();
  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">Your cart is empty.</p>;

  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div
          key={i.id}
          className="flex items-center justify-between gap-2 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{i.name}</p>
            <p className="text-muted-foreground">{inr(i.price * i.qty)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Tip label="Remove one">
              <Button
                variant="outline"
                size="icon"
                aria-label="Decrease"
                onClick={() => changeQty(i.id, -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </Tip>
            <span className="w-6 text-center">{i.qty}</span>
            <Tip label="Add one more" align="end">
              <Button
                variant="outline"
                size="icon"
                aria-label="Increase"
                onClick={() => changeQty(i.id, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </Tip>
          </div>
        </div>
      ))}
      <div className="flex justify-between border-t pt-3 font-semibold">
        <span>Total</span>
        <span>{inr(total)}</span>
      </div>
      <Button className="w-full" disabled={placing} onClick={placeOrder}>
        {getUser()
          ? placing
            ? "Placing..."
            : "Place order"
          : "Log in to place order"}
      </Button>
    </div>
  );
}
