import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const SAMPLE_BUDGETS = [
  { label: "Groceries", pct: 84, color: "oklch(0.68 0.14 150)" },
  { label: "Rent", pct: 100, color: "oklch(0.72 0.15 35)" },
  { label: "Transport", pct: 45, color: "oklch(0.75 0.13 90)" },
];

export function LoginPage() {
  const { signIn, signUp, isLoading, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "forgot">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function switchMode(next: "sign-in" | "sign-up" | "forgot") {
    setMode(next);
    setError(null);
    setResetSent(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "forgot") {
      setSubmitting(true);
      const { error: resetError } = await requestPasswordReset(email);
      setSubmitting(false);
      if (resetError) {
        setError(resetError);
      } else {
        setResetSent(true);
      }
      return;
    }

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
    <div className="theme-light min-h-screen flex">
      {/* ── Illustrative panel ── */}
      <div
        className="hidden md:flex md:w-[42%] lg:w-[38%] flex-col justify-between px-10 py-12"
        style={{ background: "oklch(0.2 0.03 150)" }}
      >
        <div>
          <span
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: "oklch(0.94 0.02 90)" }}
          >
            BudgetWise
          </span>
          <h1
            className="font-display text-3xl font-bold tracking-tight leading-tight mt-9"
            style={{ color: "oklch(0.97 0.008 90)" }}
          >
            Know where every dollar goes.
          </h1>
          <p
            className="text-sm mt-3 leading-relaxed max-w-xs"
            style={{ color: "oklch(0.72 0.02 150)" }}
          >
            Track budgets, spot trends, and stay on top of recurring bills.
          </p>
        </div>

        {/* Sample budget bars - illustrative, not live data */}
        <div className="space-y-4" aria-hidden>
          {SAMPLE_BUDGETS.map((b) => (
            <div key={b.label}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.85 0.01 150)" }}
                >
                  {b.label}
                </span>
                <span
                  className="text-[11px] font-mono tabular-nums"
                  style={{ color: "oklch(0.6 0.015 150)" }}
                >
                  {b.pct}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full w-full overflow-hidden"
                style={{ background: "oklch(0.3 0.02 150)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${b.pct}%`, background: b.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px]" style={{ color: "oklch(0.48 0.015 150)" }}>
          © {new Date().getFullYear()} BudgetWise
        </p>
      </div>

      {/* ── Sign-in form ── */}
      <div className="flex-1 flex items-center justify-center px-6 pt-[max(3rem,env(safe-area-inset-top,0px))] pb-[max(3rem,env(safe-area-inset-bottom,0px))] bg-background">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <span className="md:hidden font-display text-2xl font-bold text-foreground tracking-tight">
            BudgetWise
          </span>

          <h2 className="font-display text-lg font-bold text-foreground">
            {mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create your account"
                : "Reset your password"}
          </h2>

          {mode === "forgot" && resetSent ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                If an account exists for <strong>{email}</strong>, a reset link
                is on its way. Check your inbox (and spam folder).
              </p>
              <button
                type="button"
                onClick={() => switchMode("sign-in")}
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
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
                {mode !== "forgot" && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-medium">
                        Password
                      </Label>
                      {mode === "sign-in" && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
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
                )}

                {error && (
                  <p
                    role="alert"
                    className="text-xs text-destructive leading-relaxed"
                  >
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
                        {mode === "sign-in"
                          ? "Signing in…"
                          : mode === "sign-up"
                            ? "Signing up…"
                            : "Sending…"}
                      </span>
                    </>
                  ) : (
                    <span>
                      {mode === "sign-in"
                        ? "Sign in"
                        : mode === "sign-up"
                          ? "Create account"
                          : "Send reset link"}
                    </span>
                  )}
                </Button>
              </form>

              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "sign-up" ? "sign-in" : "sign-up")
                }
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors text-left"
              >
                {mode === "sign-up"
                  ? "Already have an account? Sign in"
                  : mode === "forgot"
                    ? "Back to sign in"
                    : "New here? Create an account"}
              </button>
            </>
          )}

          <p className="text-xs text-muted-foreground/40 md:hidden">
            © {new Date().getFullYear()} BudgetWise
          </p>
        </div>
      </div>
    </div>
  );
}
