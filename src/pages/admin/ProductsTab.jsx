import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Tip from "@/components/Tip";
import { api } from "@/lib/api";
import { formatDate, inr, selectClass } from "@/lib/format";

const EMPTY = { name: "", price: "", stock_qty: "0", category: "Other", low_stock_threshold: "5" };

// remounted for each product (see the key below), so the form starts with its values
function EditProductDialog({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          price: String(product.price),
          category: product.category,
          low_stock_threshold: String(product.low_stock_threshold),
        }
      : { name: "", price: "", category: "Other", low_stock_threshold: "5" }
  );
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    const price = Number(form.price);
    const threshold = Number(form.low_stock_threshold);

    // send only what changed, so the "updated" date only moves on real edits
    const body = {};
    if (form.name.trim() !== product.name) body.name = form.name.trim();
    if (price !== Number(product.price)) body.price = price;
    if (form.category !== product.category) body.category = form.category;
    if (threshold !== product.low_stock_threshold) body.low_stock_threshold = threshold;

    if (Object.keys(body).length === 0) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      await api(`/products/${product.id}`, { method: "PATCH", body });
      toast.success(
        body.price !== undefined
          ? `${product.name} price updated to ${inr(price)}`
          : `${product.name} updated`
      );
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            {product ? `Last updated ${formatDate(product.updated_at)}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={save} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="ename">Name</Label>
            <Input id="ename" required value={form.name} onChange={set("name")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="eprice">Price (₹)</Label>
              <Input id="eprice" type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ethreshold">Low-stock alert at</Label>
              <Input id="ethreshold" type="number" min="0" required value={form.low_stock_threshold} onChange={set("low_stock_threshold")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ecat">Category</Label>
            <select id="ecat" className={`${selectClass} w-full`} value={form.category} onChange={set("category")}>
              {(categories.length ? categories : [form.category]).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductRow({ p, onEdit, onChanged }) {
  const [qty, setQty] = useState("");
  const low = p.stock_qty <= p.low_stock_threshold;

  async function restock() {
    const n = Number(qty);
    if (!n || n <= 0) return toast.error("Enter a quantity above 0");
    try {
      await api(`/products/${p.id}/restock`, { method: "POST", body: { quantity: n } });
      toast.success(`Added ${n} to ${p.name}`);
      setQty("");
      onChanged();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{p.name}</TableCell>
      <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
      <TableCell>{inr(p.price)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {p.stock_qty}
          {low && <Badge variant="destructive">Low</Badge>}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(p.updated_at)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1" title="Edit name, price and category" onClick={() => onEdit(p)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Input
            type="number"
            min="1"
            className="h-8 w-20"
            title="How many units to add"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qty"
          />
          <Button size="sm" title="Add this quantity to stock" onClick={restock}>Restock</Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ProductsTab() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(location.state?.category || "");
  const [lowOnly, setLowOnly] = useState(Boolean(location.state?.lowStock));
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    api("/products/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({ limit: "100" });
    if (query) params.set("search", query);
    if (category) params.set("category", category);
    api(lowOnly ? "/products/low-stock" : `/products?${params}`)
      .then((d) => {
        if (!ignore) setProducts(d);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      ignore = true;
    };
  }, [query, category, tick, lowOnly]);

  async function addProduct(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/products", {
        method: "POST",
        body: {
          name: form.name,
          price: Number(form.price),
          stock_qty: Number(form.stock_qty),
          category: form.category,
          low_stock_threshold: Number(form.low_stock_threshold),
        },
      });
      toast.success("Product added");
      setForm(EMPTY);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Add product</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addProduct} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="space-y-1 lg:col-span-2">
              <Label htmlFor="pname">Name</Label>
              <Input id="pname" required value={form.name} onChange={set("name")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pprice">Price (₹)</Label>
              <Input id="pprice" type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pstock">Stock</Label>
              <Input id="pstock" type="number" min="0" required value={form.stock_qty} onChange={set("stock_qty")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pcat">Category</Label>
              <select id="pcat" className={`${selectClass} w-full`} value={form.category} onChange={set("category")}>
                {(categories.length ? categories : ["Other"]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Input className="max-w-xs" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Tip label="Show only items that are running low">
          <Button size="sm" variant={lowOnly ? "default" : "outline"} onClick={() => setLowOnly(!lowOnly)}>
            Low stock only
          </Button>
        </Tip>
      </div>

      {products === null && <p className="text-muted-foreground">Loading...</p>}
      {products?.length === 0 && <p className="text-muted-foreground">No products found.</p>}

      {products?.length > 0 && (
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <ProductRow key={p.id} p={p} onEdit={setEditing} onChanged={refresh} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EditProductDialog
        key={editing?.id ?? "none"}
        product={editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSaved={refresh}
      />
    </div>
  );
}