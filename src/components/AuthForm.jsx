import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChat } from "@/context/Chat-Context";
import { api, getUser, logout, setToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// only rendered when a client id exists, because the hook needs GoogleOAuthProvider
function GoogleButton({ onToken }) {
  const login = useGoogleLogin({
    onSuccess: (res) => onToken(res.access_token),
    onError: (err) => toast.error(err?.error_description || err?.error || "Google sign-in failed"),
    onNonOAuthError: (err) =>
      toast.error(
        err?.type === "popup_closed"
          ? "The Google window was closed before finishing"
          : err?.type === "popup_failed_to_open"
            ? "Your browser blocked the Google popup. Allow popups for this site."
            : "Google sign-in failed"
      ),
  });
  return (
    <Button type="button" variant="outline" className="h-10 w-full gap-2 text-base sm:h-11" onClick={() => login()}>
      <GoogleIcon /> Continue with Google
    </Button>
  );
}

export default function AuthForm({ mode, onModeChange, onSuccess }) {
  const isLogin = mode === "login";
  const chat = useChat();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function finish(token) {
    setToken(token);
    chat?.reset(); // every login starts a fresh assistant conversation
    onSuccess(getUser());
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    logout(); // drop any stale token first
    try {
      if (!isLogin) {
        await api("/auth/register", { method: "POST", body: form });
        toast.success("Account created");
      }
      const data = await api("/auth/login", {
        method: "POST",
        form: { username: form.email, password: form.password },
      });
      finish(data.access_token);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function google(accessToken) {
    try {
      logout();
      const data = await api("/auth/google", {
        method: "POST",
        body: { access_token: accessToken },
      });
      finish(data.access_token);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm">
        {["login", "signup"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              "h-9 rounded-md font-medium transition-colors",
              mode === m ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {!isLogin && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="h-10 sm:h-11" required value={form.name} onChange={set("name")} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="h-10 sm:h-11"
            placeholder="you@email.com"
            required
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="h-10 sm:h-11"
            required
            minLength={isLogin ? 1 : 6}
            value={form.password}
            onChange={set("password")}
          />
        </div>
        <Button type="submit" className="h-10 w-full text-base sm:h-11" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log in" : "Create account"}
        </Button>
      </form>

      {GOOGLE_ENABLED && (
        <>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleButton onToken={google} />
        </>
      )}
    </div>
  );
}