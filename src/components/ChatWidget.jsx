import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@/context/Chat-Context";
import {
  Bot,
  Clock,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShoppingBasket,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AuthDialog from "@/components/AuthDialog";
import UserAvatar from "@/components/Avatar";
import Tip from "@/components/Tip";
import { api, getUser } from "@/lib/api";
import { loadAvatarSeed, newAvatarSeed, saveAvatarSeed } from "@/lib/avatar";
import { cn } from "@/lib/utils";

// edit these with your real store details
const STORE = {
  phone: "+91 9876543210",
  email: "darapanenic1@gmail.com",
  address: "Narrawada,Ap, India",
  hours: "Every day, 6:00 AM to 9:00 PM",
};

const CUSTOMER_TIPS = ["Where is my order?", "Do you have rice in stock?"];
const ADMIN_TIPS = [
  "What are today's sales?",
  "Which items are low on stock?",
  "Any pending orders?",
];
const STATUS_LABEL = {
  sending: "Sending…",
  delivered: "Delivered",
  failed: "Not delivered",
};

function BotAvatar() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <ShoppingBasket className="h-3.5 w-3.5" />
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-label="Assistant is typing">
      {[0, 0.15, 0.3].map((d) => (
        <span
          key={d}
          className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  );
}

// new replies type themselves out; older ones show at once
function BotText({ m, onDone, onTick }) {
  const [n, setN] = useState(m.fresh ? 0 : m.text.length);

  useEffect(() => {
    if (n >= m.text.length) {
      if (m.fresh) onDone?.(m.id);
      return;
    }
    const t = setTimeout(() => {
      setN((v) => Math.min(m.text.length, v + 2));
      onTick();
    }, 18);
    return () => clearTimeout(t);
  }, [n, m, onDone, onTick]);

  return <>{m.text.slice(0, n)}</>;
}

// the Contact us tab: store details + a message form that works for guests too
function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await api("/contact", { method: "POST", body: form });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("contact form failed:", err);
      setError(err.message);
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
          <a
            href={`tel:${STORE.phone.replace(/\s/g, "")}`}
            className="hover:underline"
          >
            {STORE.phone}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <a
            href={`mailto:${STORE.email}`}
            className="break-all hover:underline"
          >
            {STORE.email}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{STORE.hours}</span>
        </li>
      </ul>

      {sent ? (
        <div className="rounded-lg border bg-muted/50 p-3 text-center">
          <p className="font-medium">Thanks! We got your message.</p>
          <p className="text-xs text-muted-foreground">
            We'll reply to your email soon.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => setSent(false)}
          >
            Send another
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2 border-t pt-3">
          <p className="font-medium">Send us a message</p>
          <Input
            placeholder="Your name"
            required
            maxLength={100}
            value={form.name}
            onChange={set("name")}
          />
          <Input
            type="email"
            placeholder="Your email"
            required
            maxLength={255}
            value={form.email}
            onChange={set("email")}
          />
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
          {error && (
            <p className="text-xs text-destructive">Could not send: {error}</p>
          )}
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const chat = useChat();
  const {
    messages,
    open,
    setOpen,
    loading,
    send,
    markSeen,
    finishAll,
    authOpen,
    setAuthOpen,
    asked,
  } = chat;

  // works even if the chat context is an older copy without tabs
  const [localView, setLocalView] = useState("chat");
  const view = chat.view ?? localView;
  const setView = chat.setView ?? setLocalView;

  const [input, setInput] = useState("");
  const [seed, setSeed] = useState(loadAvatarSeed);
  const bottomRef = useRef(null);
  const guest = !getUser();
  const tips = getUser()?.role === "admin" ? ADMIN_TIPS : CUSTOMER_TIPS;
  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id;
  // a question typed while logged out is answered right after login
  const pendingRef = useRef(
    getUser() ? sessionStorage.getItem("pendingQuestion") : null,
  );

  const scrollDown = useCallback(
    () => bottomRef.current?.scrollIntoView({ block: "end" }),
    [],
  );

  function shuffleAvatar() {
    const next = newAvatarSeed();
    saveAvatarSeed(next);
    setSeed(next);
  }

  useEffect(() => {
    const q = pendingRef.current;
    if (!q) return;
    pendingRef.current = null;
    sessionStorage.removeItem("pendingQuestion");
    setOpen(true);
    send(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const openContact = () => {
      setView("contact");
      setOpen(true);
    };
    window.addEventListener("open-contact", openContact);
    return () => window.removeEventListener("open-contact", openContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open, view]);

  function submit(e) {
    e.preventDefault();
    send(input);
    setInput("");
  }

  return (
    <>
      {open ? (
        <Card className="fixed bottom-4 right-4 z-50 w-[min(92vw,380px)] gap-3 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" /> Store assistant
              <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${guest ? "bg-muted-foreground/50" : "bg-green-500"}`}
                />
                {guest ? "Locked" : "Online"}
              </span>
            </CardTitle>
            <Tip label="Close chat" align="end">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close chat"
                onClick={() => {
                  finishAll?.();
                  setOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </Tip>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Assistant / Contact us */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm">
              {[
                ["chat", "Assistant"],
                ["contact", "Contact us"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "h-8 rounded-md font-medium transition-colors",
                    view === v
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {view === "contact" ? (
              <ContactPanel />
            ) : (
              <>
                {guest && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" /> Log in to use the
                      assistant
                    </span>
                    <Button
                      size="sm"
                      className="h-7"
                      onClick={() => setAuthOpen(true)}
                    >
                      Log in
                    </Button>
                  </div>
                )}

                <div
                  className={`space-y-3 overflow-y-auto pr-1 text-sm ${guest ? "h-40 sm:h-56" : "h-52 sm:h-72"}`}
                >
                  {messages.map((m) =>
                    m.role === "user" ? (
                      <div key={m.id} className="msg-in">
                        <div className="flex items-end justify-end gap-2">
                          <div className="max-w-[80%] wrap-break-word rounded-[1.25rem] rounded-br-md bg-blue-600 px-4 py-2 text-white">
                            {m.text}
                          </div>
                          <Tip
                            label="Tap to change your avatar"
                            side="top"
                            align="end"
                            className="shrink-0"
                          >
                            <UserAvatar seed={seed} onClick={shuffleAvatar} />
                          </Tip>
                        </div>
                        {m.id === lastUserId && m.status && (
                          <p className="mr-9 mt-1 text-right text-xs text-muted-foreground">
                            {STATUS_LABEL[m.status]}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div key={m.id} className="msg-in flex items-end gap-2">
                        <BotAvatar />
                        <div className="max-w-[80%] whitespace-pre-wrap wrap-break-word rounded-[1.25rem] rounded-bl-md bg-muted px-4 py-2">
                          <BotText
                            m={m}
                            onDone={markSeen}
                            onTick={scrollDown}
                          />
                        </div>
                      </div>
                    ),
                  )}

                  {loading && (
                    <div className="msg-in">
                      <div className="flex items-end gap-2">
                        <BotAvatar />
                        <div className="rounded-[1.25rem] rounded-bl-md bg-muted px-4 py-3">
                          <TypingDots />
                        </div>
                      </div>
                      <p className="ml-9 mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold">Assistant</span> is
                        typing…
                      </p>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {tips.map((t) => (
                      <Button
                        key={t}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => send(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                )}

                <form className="flex gap-2" onSubmit={submit}>
                  <Input
                    className="h-10 rounded-full"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      guest ? "Log in to ask..." : "Ask something..."
                    }
                    maxLength={500}
                  />
                  <Tip
                    label={guest ? "Log in to send" : "Send message"}
                    side="top"
                    align="end"
                  >
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      aria-label="Send"
                      disabled={loading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </Tip>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="fixed bottom-4 right-4 z-50">
          <Tip label="Ask the assistant" side="top" align="end">
            <Button
              className="float-slow h-12 w-12 rounded-full shadow-lg"
              size="icon"
              aria-label="Open chat"
              onClick={() => setOpen(true)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Tip>
        </div>
      )}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} question={asked} />
    </>
  );
}
