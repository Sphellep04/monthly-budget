import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: Shield,
    label: "Private & Secure",
    description: "Your data lives on-chain, not on servers",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: BarChart3,
    label: "Visual Insights",
    description: "Charts and trends at a glance",
    color: "text-chart-1",
    bg: "bg-[oklch(var(--chart-1)/0.08)]",
    border: "border-[oklch(var(--chart-1)/0.2)]",
  },
  {
    icon: RefreshCcw,
    label: "Recurring Bills",
    description: "Auto-fill monthly templates",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
] as const;

const trustPoints = [
  "No password or email required",
  "Cryptographically signed with your identity",
  "Data stored decentralized on-chain",
];

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div
      className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      data-ocid="login.page"
    >
      {/* Background depth layers */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {/* Primary orb — top right */}
        <div
          className="absolute -top-48 -right-24 w-[520px] h-[520px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, oklch(0.67 0.16 250) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Accent orb — bottom left */}
        <div
          className="absolute -bottom-32 -left-16 w-[420px] h-[420px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.77 0.18 48) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-[420px] flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo / Brand mark */}
        <div
          className="text-center animate-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md scale-110" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 shadow-elevated">
              <TrendingUp size={28} className="text-primary" strokeWidth={2} />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight mb-2 leading-none">
            BudgetWise
          </h1>
          <p className="text-muted-foreground font-body text-[0.9375rem] leading-relaxed">
            Premium monthly budget tracking.
            <br />
            <span className="text-muted-foreground/60 text-sm">
              Private. Decentralized. Yours.
            </span>
          </p>
        </div>

        {/* Main card */}
        <div
          className="w-full bg-card border border-border/80 rounded-2xl shadow-premium overflow-hidden animate-slide-up"
          style={{ animationDelay: "60ms" }}
        >
          {/* Card top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <div className="p-8">
            <div className="mb-6">
              <h2 className="font-display text-[1.25rem] font-semibold text-card-foreground tracking-tight mb-1.5">
                Sign in to continue
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use Internet Identity for secure, passwordless authentication.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className={cn(
                "w-full gap-2.5 font-semibold text-[0.9375rem] h-12 rounded-xl shadow-elevated button-hover",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "border border-primary/20",
                "relative overflow-hidden group",
              )}
              onClick={login}
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              {/* Shimmer overlay on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -skew-x-12 translate-x-[-120%] group-hover:translate-x-[120%] duration-700" />

              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin flex-shrink-0" />
                  <span>Connecting…</span>
                </>
              ) : (
                <>
                  <span>Sign in with Internet Identity</span>
                  <ArrowRight
                    size={16}
                    className="flex-shrink-0 transition-spring group-hover:translate-x-0.5"
                  />
                </>
              )}
            </Button>

            {/* Trust points */}
            <div className="mt-5 space-y-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={13}
                    className="text-[oklch(var(--chart-1))] flex-shrink-0"
                  />
                  <span className="text-xs text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-3 gap-3 w-full animate-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          {features.map(
            ({ icon: Icon, label, description, color, bg, border }) => (
              <div
                key={label}
                className={cn(
                  "group bg-card border rounded-xl px-3 py-4 flex flex-col items-center gap-2 text-center shadow-subtle card-hover",
                  border,
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-spring group-hover:scale-110",
                    bg,
                  )}
                >
                  <Icon size={15} className={color} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">
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
        <p
          className="text-xs text-muted-foreground/50 text-center animate-fade-in"
          style={{ animationDelay: "180ms" }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-muted-foreground transition-colors-fast underline-offset-2 hover:underline"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
