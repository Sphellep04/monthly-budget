import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ResetPasswordPage() {
  const { isPasswordRecovery, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/" }), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-background">
      <div className="w-full max-w-sm bg-card border border-border/80 rounded-2xl shadow-premium p-7">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="w-6 h-6" />
          </div>
        ) : !isPasswordRecovery ? (
          <>
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight mb-2">
              Link expired
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              This password reset link is invalid or has expired. Request a new
              one from the sign-in page.
            </p>
            <Button
              className="w-full button-hover"
              onClick={() => navigate({ to: "/" })}
            >
              Back to sign in
            </Button>
          </>
        ) : done ? (
          <>
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight mb-2">
              Password updated
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Taking you to your budgets…
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight mb-1">
              Set a new password
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Choose a new password for your account.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password" className="text-xs font-medium">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-medium"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="w-full font-semibold h-11 rounded-xl button-hover mt-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
