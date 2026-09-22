import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { inr, selectClass } from "@/lib/format";

const STATUSES = ["placed", "packed", "shipped", "delivered"];

export default function OrdersTab() {
  const [orders, setOrders] = useState(null);
  const [status, setStatus] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let ignore = false;
    const filter = status ? `&status=${status}` : "";
    api(`/orders?limit=50${filter}`)
      .then((d) => {
        if (!ignore) setOrders(d);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      ignore = true;
    };
  }, [status, tick]);

  async function changeStatus(id, next) {
    try {
      await api(`/orders/${id}/status`, { method: "PATCH", body: { status: next } });
      toast.success(`Order #${id} marked ${next}`);
      setTick((t) => t + 1);
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span>Filter:</span>
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-muted-foreground">(latest 50)</span>
      </div>

      {orders === null && <p className="text-muted-foreground">Loading...</p>}
      {orders?.length === 0 && <p className="text-muted-foreground">No orders found.</p>}

      {orders?.length > 0 && (
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.user_name}</TableCell>
                  <TableCell className="max-w-64 truncate">
                    {o.items.map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}
                  </TableCell>
                  <TableCell>{inr(o.total)}</TableCell>
                  <TableCell className="whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={o.status === "placed" ? "secondary" : "default"}>{o.status}</Badge>
                      <select
                        className={selectClass}
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}