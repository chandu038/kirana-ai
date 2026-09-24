import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { api, getUser } from "@/lib/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false); // cart popup
  const [authOpen, setAuthOpen] = useState(false); // login popup for guests placing an order
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null); // last order, for the success popup
  const [version, setVersion] = useState(0); // bumps after an order so stock reloads

  function add(p) {
    const item = items.find((i) => i.id === p.id);
    if (item && item.qty >= p.stock_qty) return toast.error("No more stock available");
    setItems(
      item
        ? items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { id: p.id, name: p.name, price: Number(p.price), qty: 1, max: p.stock_qty }]
    );
    toast.success(`${p.name} added to cart`, { duration: 1500 });
  }

  function changeQty(id, delta) {
    const item = items.find((i) => i.id === id);
    const qty = item.qty + delta;
    if (qty > item.max) return toast.error("No more stock available");
    setItems(qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  // returns true when the order was placed
  async function placeOrder() {
    // guests can fill a cart, but must log in to order (the cart is kept)
    if (!getUser()) {
      setOpen(false);
      setAuthOpen(true);
      return false;
    }
    setPlacing(true);
    try {
      const order = await api("/orders", {
        method: "POST",
        body: { items: items.map((i) => ({ product_id: i.id, quantity: i.qty })) },
      });
      setPlaced({ items, total: order.total });
      setItems([]);
      setOpen(false);
      setVersion((v) => v + 1);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setPlacing(false);
    }
  }

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  const clear = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items, add, changeQty, placeOrder, placing, placed, setPlaced,
        open, setOpen, authOpen, setAuthOpen, count, total, version, clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);