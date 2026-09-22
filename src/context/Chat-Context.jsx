import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, chatSessionId, getUser } from "@/lib/api";

const ChatContext = createContext(null);
const KEY = "chatMessages";

let counter = 0;
const uid = () => `${Date.now()}-${counter++}`;

const greeting = (role) => ({
  id: uid(),
  role: "bot",
  fresh: false,
  text:
    role === "admin"
      ? "Hi! Ask me about sales, pending orders or low stock."
      : "Hi! Ask me about your orders or our products.",
});

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (getUser() && Array.isArray(saved) && saved.length) {
      return saved.map((m) => ({
        ...m,
        id: m.id ?? uid(),
        fresh: false,
        status: m.status === "sending" ? "delivered" : m.status,
      }));
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => loadSaved() ?? [greeting(getUser()?.role)]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("chat"); // "chat" or "contact"
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [asked, setAsked] = useState("");

  // keep the conversation across page changes and refreshes, until logout
  useEffect(() => {
    if (getUser()) {
      const clean = messages.slice(-50).map((m) => ({ ...m, fresh: false }));
      localStorage.setItem(KEY, JSON.stringify(clean));
    }
  }, [messages]);

  async function send(text) {
    const q = text.trim();
    if (!q || loading) return;

    // the assistant only works for logged-in users
    if (!getUser()) {
      sessionStorage.setItem("pendingQuestion", q);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "user", text: q, status: "delivered" },
        { id: uid(), role: "bot", text: "Please log in or sign up to continue.", fresh: true },
      ]);
      setAsked(q);
      setAuthOpen(true);
      return;
    }

    const id = uid();
    setMessages((m) => [...m, { id, role: "user", text: q, status: "sending" }]);
    setLoading(true);
    const setStatus = (status) => (list) => list.map((x) => (x.id === id ? { ...x, status } : x));
    try {
      const data = await api("/chat", {
        method: "POST",
        body: { message: q, session_id: chatSessionId() },
      });
      setMessages((m) => [...setStatus("delivered")(m), { id: uid(), role: "bot", text: data.reply, fresh: true }]);
    } catch (err) {
      setMessages((m) => [...setStatus("failed")(m), { id: uid(), role: "bot", text: err.message, fresh: true }]);
    } finally {
      setLoading(false);
    }
  }

  // a reply has finished typing out
  const markSeen = useCallback(
    (id) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, fresh: false } : x))),
    []
  );
  const finishAll = useCallback(
    () => setMessages((m) => m.map((x) => (x.fresh ? { ...x, fresh: false } : x))),
    []
  );

  // opens the chat window on the Contact us tab (used by the navbar)
  const openContact = useCallback(() => {
    setView("contact");
    setOpen(true);
  }, []);

  // call after login or logout to start a clean conversation
  function reset() {
    setMessages([greeting(getUser()?.role)]);
    setLoading(false);
    setOpen(false);
    setView("chat");
  }

  return (
    <ChatContext.Provider
      value={{
        messages, open, setOpen, view, setView, openContact, loading, send, reset,
        markSeen, finishAll, authOpen, setAuthOpen, asked,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);