import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HowItWorksCarousel } from "./HowItWorksCarousel";

const trustPoints = [
  "Your data is private to your account",
  "Access your budget from any device",
  "Passwords are never stored in plain text",
];

const features = [
  {
    label: "Private & Secure",
    description: "Your data is private to your account",
  },
  {
    label: "Visual Insights",
    description: "Charts and trends at a glance",
  },
  {
    label: "Recurring Bills",
    description: "Auto-fill monthly templates",
  },
];

const previewCards = [
  {
    title: "April Budget",
    value: "$3,200",
    sub: "$2,154 spent",
    pct: 67,
    tag: "67% used",
    tagBg: "rgba(251,191,36,0.18)",
    tagColor: "#fbbf24",
    barColor: "#fbbf24",
  },
  {
    title: "Savings Goal",
    value: "$1,048",
    sub: "of $3,200 target",
    pct: 33,
    tag: "On track",
    tagBg: "rgba(52,211,153,0.18)",
    tagColor: "#34d399",
    barColor: "#34d399",
  },
  {
    title: "Bills Due",
    value: "3 pending",
    sub: "Next due: Apr 22",
    pct: 40,
    tag: "Up to date",
    tagBg: "rgba(96,165,250,0.18)",
    tagColor: "#60a5fa",
    barColor: "#60a5fa",
  },
];

export function LoginPage() {
  const { signIn, signUp, isLoading } = useAuth();
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
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
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left Hero Panel ── */}
      <div
        className="hidden lg:flex w-[58%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "oklch(0.12 0.011 150)" }}
      >
        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="bg-white/95 rounded-xl px-3 py-2 inline-flex shadow-subtle">
            <img
              src="/BudgetWise-Logo.png"
              alt="BudgetWise"
              className="h-12 w-auto object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Center: Headline + floating preview cards */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-10 mt-10">
          <div>
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "oklch(0.64 0.14 150 / 0.7)" }}
            >
              Personal Finance
            </p>
            <h2
              className="font-display text-[2.8rem] leading-[1.08] font-bold mb-5"
              style={{ color: "oklch(0.97 0.005 0)" }}
            >
              Know where
              <br />
              every dollar
              <br />
              goes.
            </h2>
            <p
              className="text-[0.9375rem] leading-relaxed max-w-[340px]"
              style={{ color: "oklch(0.60 0.02 150)" }}
            >
              Track budgets, spot trends, and stay on top of recurring bills -
              synced securely to your account.
            </p>
          </div>

          {/* Preview cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {previewCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-4"
                style={{
                  background: "oklch(0.16 0.013 150)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.65 0.02 150)" }}
                  >
                    {card.title}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: card.tagBg,
                      color: card.tagColor,
                    }}
                  >
                    {card.tag}
                  </span>
                </div>
                <p
                  className="text-[1.3rem] font-bold mb-0.5 leading-none"
                  style={{ color: "oklch(0.94 0.005 150)" }}
                >
                  {card.value}
                </p>
                <p
                  className="text-xs mb-3"
                  style={{ color: "oklch(0.48 0.02 150)" }}
                >
                  {card.sub}
                </p>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "oklch(1 0 0 / 0.08)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${card.pct}%`,
                      background: card.barColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Feature pills */}
        <div className="relative z-10 flex flex-wrap gap-2.5">
          {features.map(({ label }) => (
            <div
              key={label}
              className="px-3.5 py-2 rounded-full text-xs font-medium"
              style={{
                background: "oklch(1 0 0 / 0.05)",
                border: "1px solid oklch(1 0 0 / 0.09)",
                color: "oklch(0.58 0.02 150)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background relative overflow-hidden">
        <div className="relative w-full max-w-sm flex flex-col gap-7 animate-slide-up">
          {/* Mobile-only brand header */}
          <div
            className="flex flex-col items-center lg:hidden"
            style={{ animationDelay: "0ms" }}
          >
            <img
              src="/BudgetWise-Logo.png"
              alt="BudgetWise"
              className="h-16 w-auto object-contain mb-2"
              draggable={false}
            />
            <p className="text-sm text-muted-foreground">
              Private. Synced. Yours.
            </p>
          </div>

          {/* Desktop heading above card */}
          <div className="hidden lg:block">
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight leading-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to continue managing your finances.
            </p>
          </div>

          {/* Auth card */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-premium overflow-hidden">
            {/* Top accent line */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

            <div className="p-7">
              {/* Mobile heading inside card */}
              <div className="lg:hidden mb-5">
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
                  Sign in to continue
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Continue with a simple local sign-in.
                </p>
              </div>

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

                {/* CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    "w-full gap-2.5 font-semibold text-[0.9375rem] h-12 rounded-xl button-hover mt-1",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "shadow-elevated",
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

              {/* Mode toggle */}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                  setError(null);
                }}
                className="w-full mt-3 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === "sign-in"
                  ? "New here? Create an account"
                  : "Already have an account? Sign in"}
              </button>

              {/* How it works trigger */}
              <button
                type="button"
                onClick={() => setHowItWorksOpen(true)}
                className="w-full mt-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                See how it works
              </button>

              {/* Trust points */}
              <ul className="mt-5 space-y-2 pt-5 border-t border-border/50 list-disc list-inside marker:text-chart-1">
                {trustPoints.map((point) => (
                  <li
                    key={point}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature cards - shown on right panel on both mobile + desktop */}
          <div className="grid grid-cols-3 gap-2.5">
            {features.map(({ label, description }) => (
              <div
                key={label}
                className="bg-card border border-border/60 rounded-xl px-2.5 py-3.5 flex flex-col items-center text-center shadow-subtle card-hover"
              >
                <p className="text-[11px] font-semibold text-foreground leading-tight">
                  {label}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/40 text-center">
            © {new Date().getFullYear()} BudgetWise
          </p>
        </div>
      </div>

      <HowItWorksCarousel
        open={howItWorksOpen}
        onOpenChange={setHowItWorksOpen}
      />
    </div>
  );
}
