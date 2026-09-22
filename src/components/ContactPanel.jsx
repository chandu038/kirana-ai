import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { STORE } from "@/lib/store-info";

export default function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await api("/contact", { method: "POST", body: form });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-64 space-y-3 overflow-y-auto pr-1 text-sm sm:h-80">
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{STORE.address}</span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <a href={`tel:${STORE.phone.replace(/\s/g, "")}`} className="hover:underline">{STORE.phone}</a>
        </li>
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <a href={`mailto:${STORE.email}`} className="break-all hover:underline">{STORE.email}</a>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{STORE.hours}</span>
        </li>
      </ul>

      {sent ? (
        <div className="rounded-lg border bg-muted/50 p-3 text-center">
          <p className="font-medium">Thanks! We got your message.</p>
          <p className="text-xs text-muted-foreground">We'll reply to your email soon.</p>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => setSent(false)}>
            Send another
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2 border-t pt-3">
          <p className="font-medium">Send us a message</p>
          <Input placeholder="Your name" required maxLength={100} value={form.name} onChange={set("name")} />
          <Input type="email" placeholder="Your email" required maxLength={255} value={form.email} onChange={set("email")} />
          <textarea
            placeholder="How can we help?"
            required
            minLength={5}
            maxLength={1000}
            rows={3}
            value={form.message}
            onChange={set("message")}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}