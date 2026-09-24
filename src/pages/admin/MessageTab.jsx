import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function MessagesTab() {
  const [messages, setMessages] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let ignore = false;
    api("/admin/messages")
      .then((d) => {
        if (!ignore) setMessages(d);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      ignore = true;
    };
  }, [tick]);

  async function remove(id) {
    try {
      await api(`/admin/messages/${id}`, { method: "DELETE" });
      toast.success("Message deleted");
      setTick((t) => t + 1);
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="space-y-3">
      {messages === null && <p className="text-muted-foreground">Loading...</p>}
      {messages?.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}

      {messages?.map((m) => (
        <Card key={m.id}>
          <CardContent className="space-y-2 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{m.name}</p>
                <a href={`mailto:${m.email}`} className="break-all text-sm text-muted-foreground hover:underline">
                  {m.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
                <Button variant="ghost" size="icon" title="Delete this message" aria-label="Delete message" onClick={() => remove(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="whitespace-pre-wrap wrap-break-word text-sm">{m.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}