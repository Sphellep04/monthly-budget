import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { signIn, signUp, isLoading } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: authError } =
      mode === "sign-in"
        ? await signIn(email, password)
        : await signUp(email, password);
    setSubmitting(false);
    if (authError) {
      setError(authError);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Wordmark + headline */}
        <div className="flex flex-col gap-4">
          <img
            src="/BudgetWise-Logo.png"
            alt="BudgetWise"
            className="h-10 w-auto object-contain"
            draggable={false}
          />
          <div className="w-12 h-px bg-border" aria-hidden />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Know where every dollar goes.
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Track budgets, spot trends, and stay on top of recurring bills.
            </p>
          </div>
        </div>

        {/* Ledger box */}
        <div className="border border-border rounded-md overflow-hidden bg-card">
          <div className="h-[3px] bg-primary" aria-hidden />
          <div className="p-7">
            <h2 className="font-display text-lg font-bold text-foreground mb-5">
              {mode === "sign-in" ? "Sign in" : "Create your account"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive leading-relaxed">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className={cn(
                  "w-full font-semibold text-[0.9375rem] h-12 rounded-md mt-1",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                )}
                disabled={isLoading || submitting}
              >
                {submitting ? (
                  <>
                    <Spinner className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {mode === "sign-in" ? "Signing in…" : "Signing up…"}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === "sign-in" ? "Sign in" : "Create account"}
                  </span>
                )}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                setError(null);
              }}
              className="w-full mt-4 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "sign-in"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} BudgetWise
        </p>
      </div>
    </div>
  );
}
