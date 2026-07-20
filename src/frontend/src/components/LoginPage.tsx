import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const trustPoints = [
  "No password or email required",
  "Your data stays in your browser storage",
  "Works locally without any hosted backend",
];

const features = [
  {
    icon: Shield,
    label: "Private & Secure",
    description: "Your data stays in your browser storage",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: BarChart3,
    label: "Visual Insights",
    description: "Charts and trends at a glance",
    color: "text-chart-1",
    bg: "bg-[oklch(0.72_0.19_141/0.1)]",
    border: "border-[oklch(0.72_0.19_141/0.2)]",
  },
  {
    icon: RefreshCcw,
    label: "Recurring Bills",
    description: "Auto-fill monthly templates",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
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
    animDelay: "0s",
    rotate: "-3deg",
    style: { top: "0%", left: "0%" },
    zIndex: 10,
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
    animDelay: "1.3s",
    rotate: "2.5deg",
    style: { top: "26%", right: "0%" },
    zIndex: 20,
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
    animDelay: "0.7s",
    rotate: "-1.5deg",
    style: { bottom: "0%", left: "8%" },
    zIndex: 30,
  },
];

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left Hero Panel ── */}
      <div
        className="hidden lg:flex w-[58%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.14 0.025 268) 0%, oklch(0.10 0.018 260) 55%, oklch(0.07 0.01 248) 100%)",
        }}
      >
        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Primary glow — upper right */}
          <div
            className="absolute -top-32 -right-20 w-[580px] h-[580px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.67 0.16 250 / 0.28) 0%, transparent 65%)",
              filter: "blur(70px)",
            }}
          />
          {/* Green glow — lower left */}
          <div
            className="absolute -bottom-24 -left-16 w-[460px] h-[460px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.72 0.19 141 / 0.16) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
          {/* Warm accent — center */}
          <div
            className="absolute top-[45%] left-[38%] w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.77 0.18 48 / 0.1) 0%, transparent 65%)",
              filter: "blur(55px)",
            }}
          />
          {/* Dot grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {/* Faint diagonal lines */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, oklch(1 0 0) 0, oklch(1 0 0) 1px, transparent 0, transparent 50%)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="bg-white/95 rounded-xl px-3 py-2 inline-flex shadow-subtle">
            <img
              src="/BudgetWise-Logo.png"
              alt="BudgetWise"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Center: Headline + floating preview cards */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-10 mt-10">
          <div>
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "oklch(0.67 0.16 250 / 0.7)" }}
            >
              Personal Finance
            </p>
            <h2
              className="font-display text-[2.8rem] leading-[1.08] font-bold mb-5"
              style={{
                background:
                  "linear-gradient(128deg, oklch(0.97 0.005 0) 0%, oklch(0.78 0.06 250) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Know where
              <br />
              every dollar
              <br />
              goes.
            </h2>
            <p
              className="text-[0.9375rem] leading-relaxed max-w-[340px]"
              style={{ color: "oklch(0.60 0.02 265)" }}
            >
              Track budgets, spot trends, and stay on top of recurring bills —
              all with private local storage.
            </p>
          </div>

          {/* Floating preview cards */}
          <div className="relative h-80 w-full">
            {previewCards.map((card) => (
              <div
                key={card.title}
                className="absolute w-60 rounded-2xl p-4"
                style={{
                  ...card.style,
                  zIndex: card.zIndex,
                  background: "oklch(0.18 0.022 268 / 0.88)",
                  border: "1px solid oklch(1 0 0 / 0.09)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow:
                    "0 24px 48px -12px oklch(0 0 0 / 0.55), inset 0 1px 0 0 oklch(1 0 0 / 0.07)",
                  transform: `rotate(${card.rotate})`,
                  animation: `float 4s ease-in-out ${card.animDelay} infinite`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.65 0.02 265)" }}
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
                  style={{ color: "oklch(0.94 0.005 250)" }}
                >
                  {card.value}
                </p>
                <p
                  className="text-xs mb-3"
                  style={{ color: "oklch(0.48 0.02 265)" }}
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
                      boxShadow: `0 0 8px ${card.barColor}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Feature pills */}
        <div className="relative z-10 flex flex-wrap gap-2.5">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium"
              style={{
                background: "oklch(1 0 0 / 0.05)",
                border: "1px solid oklch(1 0 0 / 0.09)",
                color: "oklch(0.58 0.02 265)",
              }}
            >
              <Icon size={11} style={{ color: "oklch(0.52 0.04 265)" }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute -top-40 -right-24 w-96 h-96 rounded-full opacity-[0.18]"
            style={{
              background:
                "radial-gradient(circle, oklch(0.67 0.16 250) 0%, transparent 70%)",
              filter: "blur(64px)",
            }}
          />
          <div
            className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-[0.1]"
            style={{
              background:
                "radial-gradient(circle, oklch(0.77 0.18 48) 0%, transparent 70%)",
              filter: "blur(64px)",
            }}
          />
        </div>

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
              Private. Local-first. Yours.
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

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/50 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex-shrink-0">
                  <Shield size={16} className="text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Local Sign-In
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Secure, lightweight browser authentication
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className={cn(
                  "w-full gap-2.5 font-semibold text-[0.9375rem] h-12 rounded-xl button-hover",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "relative overflow-hidden group shadow-elevated",
                )}
                onClick={login}
                disabled={isLoading}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -skew-x-12 translate-x-[-120%] group-hover:translate-x-[120%] duration-700" />
                {isLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin flex-shrink-0" />
                    <span>Connecting…</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Local Sign-In</span>
                    <ArrowRight
                      size={16}
                      className="flex-shrink-0 transition-spring group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </Button>

              {/* Trust points */}
              <div className="mt-5 space-y-2.5 pt-5 border-t border-border/50">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={13}
                      className="text-chart-1 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature cards — shown on right panel on both mobile + desktop */}
          <div className="grid grid-cols-3 gap-2.5">
            {features.map(
              ({ icon: Icon, label, description, color, bg, border }) => (
                <div
                  key={label}
                  className={cn(
                    "group bg-card border rounded-xl px-2.5 py-3.5 flex flex-col items-center gap-2 text-center shadow-subtle card-hover",
                    border,
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-spring group-hover:scale-110",
                      bg,
                    )}
                  >
                    <Icon size={14} className={color} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground leading-tight">
                      {label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/40 text-center">
            © {new Date().getFullYear()} BudgetWise
          </p>
        </div>
      </div>
    </div>
  );
}
