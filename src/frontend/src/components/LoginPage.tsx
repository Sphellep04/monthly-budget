import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Loader2,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4"
      data-ocid="login.page"
    >
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 mb-4 shadow-sm">
            <TrendingUp size={26} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            BudgetWise
          </h1>
          <p className="text-muted-foreground font-body text-base">
            Take control of your monthly finances
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-card-foreground mb-1">
            Sign in to continue
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Secure, decentralized authentication with Internet Identity.
          </p>

          <Button
            size="lg"
            className="w-full gap-2.5 font-semibold transition-smooth"
            onClick={login}
            disabled={isLoading}
            data-ocid="login.submit_button"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                Sign in with Internet Identity
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            No password needed. Cryptographically secure.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <Shield size={15} />, label: "Private & Secure" },
            { icon: <BarChart3 size={15} />, label: "Visual Insights" },
            { icon: <TrendingUp size={15} />, label: "Smart Tracking" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="bg-card/60 border border-border rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 text-center"
            >
              <span className="text-primary">{icon}</span>
              <span className="text-xs text-muted-foreground font-medium leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground transition-smooth"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}
