import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tip from "@/components/Tip";
import { api } from "@/lib/api";
import { inr } from "@/lib/format";

function Stat({ title, value, to, state, tip }) {
  return (
    <Tip label={tip} className="flex h-full w-full">
      <Link to={to} state={state} className="block w-full">
        <Card className="h-full transition hover:shadow-md hover:ring-1 hover:ring-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{value}</CardContent>
        </Card>
      </Link>
    </Tip>
  );
}

function Bar({ label, value, max, text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-24 shrink-0 truncate text-muted-foreground">{label}</span>
      <div className="h-3 flex-1 rounded bg-muted">
        <div className="h-3 rounded bg-primary" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="w-20 shrink-0 text-right">{text}</span>
    </div>
  );
}

export default function OverviewTab() {
  const [s, setS] = useState(null);
  const [ai, setAi] = useState(null);

  useEffect(() => {
    api("/admin/summary").then(setS).catch((e) => toast.error(e.message));
    api("/chat/stats").then(setAi).catch((e) => toast.error(e.message));
  }, []);

  if (!s) return <p className="text-muted-foreground">Loading...</p>;

  const maxSale = Math.max(1, ...s.sales_last_7_days.map((d) => d.total));
  const maxQty = Math.max(1, ...s.top_products.map((p) => p.quantity));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat title="Orders today" value={s.orders_today} to="/admin/orders" tip="See all orders" />
        <Stat title="Revenue today" value={inr(s.revenue_today)} to="/admin/orders" tip="See the orders behind it" />
        <Stat title="Pending orders" value={s.pending_orders} to="/admin/orders" state={{ status: "pending" }} tip="Orders waiting to ship" />
        <Stat title="Low-stock items" value={s.low_stock} to="/admin/products" state={{ lowStock: true }} tip="Items running low" />
        <Stat title="Customers" value={s.customers} to="/admin/users" tip="See all customers" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Sales, last 7 days</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {s.sales_last_7_days.length === 0 && <p className="text-sm text-muted-foreground">No sales yet.</p>}
            {s.sales_last_7_days.map((d) => (
              <Bar key={d.date} label={d.date.slice(5)} value={d.total} max={maxSale} text={inr(d.total)} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top products</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {s.top_products.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {s.top_products.map((p) => (
              <Bar key={p.name} label={p.name} value={p.quantity} max={maxQty} text={`${p.quantity} sold`} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Orders by status</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            {["placed", "packed", "shipped", "delivered", "cancelled"].map((st) => (
              <Link
                key={st}
                to="/admin/orders"
                state={{ status: st }}
                className="flex justify-between rounded border px-3 py-2 hover:bg-muted"
              >
                <span className="capitalize">{st}</span>
                <span className="font-semibold">{s.by_status[st] ?? 0}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Assistant usage</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            {ai ? (
              <>
                <div>Requests: <b>{ai.requests}</b></div>
                <div>Est. cost: <b>${ai.estimated_cost_usd}</b></div>
                <div>Tokens in: <b>{ai.input_tokens}</b></div>
                <div>Tokens out: <b>{ai.output_tokens}</b></div>
                <div>Avg latency: <b>{ai.avg_latency_ms} ms</b></div>
                <div>P95 latency: <b>{ai.p95_latency_ms} ms</b></div>
                <div>Blocked: <b>{ai.by_status.blocked ?? 0}</b></div>
                <div>Errors: <b>{ai.by_status.error ?? 0}</b></div>
              </>
            ) : (
              <p className="text-muted-foreground">Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}