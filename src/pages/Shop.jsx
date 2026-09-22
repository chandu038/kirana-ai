import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Tip from "@/components/Tip";
import { useCart } from "@/context/Cart-Context";
import { api } from "@/lib/api";
import { inr } from "@/lib/format";

const PAGE_SIZE = 12;

function stockLabel(p) {
  if (p.stock_qty === 0) return "Out of stock";
  if (p.stock_qty <= p.low_stock_threshold) return `Only ${p.stock_qty} left`;
  return "In stock";
}

export default function Shop() {
  const { add, items, changeQty, version } = useCart();
  const [params] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(params.get("category") || "");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api("/products/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    const qs = new URLSearchParams({
      skip: String(page * PAGE_SIZE),
      limit: String(PAGE_SIZE),
    });
    if (query) qs.set("search", query);
    if (category) qs.set("category", category);
    api(`/products?${qs}`)
      .then((data) => {
        if (!ignore) setProducts(data);
      })
      .catch((err) => toast.error(err.message));
    return () => {
      ignore = true;
    };
  }, [page, query, category, version]);

  return (
    <section className="space-y-4">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {["", ...categories].map((c) => (
          <Button
            key={c || "all"}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => {
              setCategory(c);
              setPage(0);
            }}
          >
            {c || "All"}
          </Button>
        ))}
      </div>

      {products === null && <p className="text-muted-foreground">Loading...</p>}
      {products?.length === 0 && (
        <p className="text-muted-foreground">No products found.</p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((p) => {
          const inCart = items.find((i) => i.id === p.id);
          return (
            <Card key={p.id}>
              <CardHeader className="space-y-1 px-3 sm:px-6">
                <Badge variant="secondary" className="w-fit">
                  {p.category}
                </Badge>
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{inr(p.price)}</span>
                  <span
                    className={`text-xs ${p.stock_qty === 0 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {stockLabel(p)}
                  </span>
                </div>
                {inCart ? (
                  <div className="flex items-center justify-between">
                    <Tip label="Remove one">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Decrease"
                        onClick={() => changeQty(p.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </Tip>
                    <span className="text-sm font-medium">
                      {inCart.qty} in cart
                    </span>
                    <Tip label="Add one more" align="end">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Increase"
                        onClick={() => changeQty(p.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </Tip>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={p.stock_qty === 0}
                    onClick={() => add(p)}
                  >
                    Add to cart
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page + 1}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!products || products.length < PAGE_SIZE}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
