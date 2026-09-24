import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import StoreIllustration from "@/components/StoreIllustration";
import { afterLoginPath } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = mode === "login";
  const pending = sessionStorage.getItem("pendingQuestion");
  const from = location.state?.from;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* laptop only: store panel */}
      <div className="hidden flex-col justify-between bg-muted p-10 lg:flex">
        <Link to="/"><Logo /></Link>
        <div className="mx-auto w-full max-w-md space-y-5">
          <StoreIllustration />
          <p className="text-center text-muted-foreground">
            Order groceries, track every order and ask the assistant about your orders.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kirana AI</p>
      </div>

      {/* form side: phone and laptop */}
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-9 gap-1")}>
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <ModeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Logo className="lg:hidden" />
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {pending
                  ? `Continue to ask: "${pending}"`
                  : from
                    ? "Please log in to continue."
                    : "Please sign up or sign in below."}
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
              <AuthForm
                mode={mode}
                onModeChange={(m) => navigate(m === "login" ? "/login" : "/signup", { state: location.state })}
                onSuccess={(user) => navigate(afterLoginPath(user, from), { replace: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}