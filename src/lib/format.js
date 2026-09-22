export const inr = (n) => `₹${Number(n).toFixed(2)}`;

export const selectClass =
  "h-9 rounded-md border border-input bg-background px-2 text-sm";

export function orderTitle(o) {
  const names = o.items.map((i) => i.product_name);
  return names.length <= 2
    ? names.join(", ")
    : `${names[0]}, ${names[1]} +${names.length - 2} more`;
}

export const badgeVariant = (status) =>
  status === "placed" ? "secondary" : status === "cancelled" ? "destructive" : "default";

// the server saves UTC times without a timezone marker, so add one before showing them
export function formatDate(value) {
  if (!value) return "";
  const s = String(value);
  const d = new Date(/([zZ]|[+-]\d{2}:?\d{2})$/.test(s) ? s : `${s}Z`);
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}