import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";
import { afterLoginPath } from "@/lib/api";

// question: the assistant question waiting for login
// reason: why login is needed (e.g. placing an order)
// onLoggedIn: runs after login instead of the default redirect
export default function AuthDialog({ open, onOpenChange, question, reason, onLoggedIn }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] gap-3 overflow-y-auto p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="font-display text-xl sm:text-2xl">
            {mode === "login" ? "Log in to continue" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {question
              ? `Sign in to get an answer to: "${question}"`
              : reason || "Please sign up or sign in below."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm
          mode={mode}
          onModeChange={setMode}
          onSuccess={(user) => {
            onOpenChange(false);
            if (onLoggedIn) onLoggedIn(user);
            else navigate(afterLoginPath(user));
          }}
        />
      </DialogContent>
    </Dialog>
  );
}