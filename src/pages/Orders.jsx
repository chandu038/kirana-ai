import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CancelOrderDialog from "@/components/CancelOrderDialog";
import Tip from "@/components/Tip";
import { api } from "@/lib/api";
import { badgeVariant, inr, orderTitle } from "@/lib/format";

const STEPS = ["placed", "packed", "shipped", "delivered"];
const CANCELLABLE = ["placed", "packed"];

function Timeline({ status }) {
  const current = STEPS.indexOf(status);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${i <= current ? "bg-primary" : "bg-muted-foreground/30"}`} />
          <span className={i <= current ? "font-medium" : "text-muted-foreground"}>{s}</span>
          {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" />}
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [tick, setTick] = useState(0);
  const [toCancel, setToCancel] = useState(null);

  useEffect(() => {
    let ignore = false;
    const load = () =>
      api("/orders?limit=50")
        .then((data) => {
          if (!ignore) setOrders(data);
        })
        .catch((err) => toast.error(err.message));
    load();
    const id = setInterval(load, 15000); // pick up status changes from the admin
    return () => {
      ignore = true;
      clearInterval(id);
    };
  }, [tick]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      {orders === null && <p className="text-muted-foreground">Loading...</p>}
      {orders?.length === 0 && <p className="text-muted-foreground">No orders yet. Go to the shop!</p>}

      {orders?.map((o) => (
        <Card key={o.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <div className="min-w-0">
              <CardTitle className="text-base">{orderTitle(o)}</CardTitle>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <Badge
              className={o.status === "delivered" ? "bg-green-600 text-white" : ""}
              variant={badgeVariant(o.status)}
            >
              {o.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {o.status !== "cancelled" && <Timeline status={o.status} />}
            <ul className="space-y-1 text-sm">
              {o.items.map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{it.product_name} × {it.quantity}</span>
                  <span className="text-muted-foreground">{inr(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Total {inr(o.total)}</span>
              {CANCELLABLE.includes(o.status) && (
                <Tip label="Cancel this order. Items go back to stock." side="top" align="end">
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => setToCancel(o)}>
                    Cancel order
                  </Button>
                </Tip>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <CancelOrderDialog
        order={toCancel}
        onClose={() => setToCancel(null)}
        onCancelled={() => setTick((t) => t + 1)}
      />
    </div>
  );
}