import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { inr, orderDateTime } from "@/lib/format";

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    let ignore = false;

    api("/orders?limit=50")
      .then((data) => {
        if (!ignore) setOrders(data);
      })
      .catch((e) => toast.error(e.message));

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">My Orders</h1>

      {orders === null && (
        <p className="text-muted-foreground">Loading...</p>
      )}

      {orders?.length === 0 && (
        <p className="text-muted-foreground">No orders found.</p>
      )}

      <div className="space-y-4">
        {orders?.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    Order #{o.id}
                  </CardTitle>

                  <p className="text-xs text-muted-foreground">
                    {orderDateTime(o.created_at)}
                  </p>
                </div>

                <Badge
                  variant={
                    o.status === "placed" ? "secondary" : "default"
                  }
                >
                  {o.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {o.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.product_name} ×{item.quantity}
                    </span>

                    <span>{inr(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-3 font-medium">
                <span>Total</span>
                <span>{inr(o.total)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}