import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertTriangle, Bell, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateUserSettings, useUserSettings } from "../hooks/useBudget";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();
  const { theme, setTheme } = useTheme();

  const [threshold, setThreshold] = useState(80);

  useEffect(() => {
    if (settings?.alertThresholdPercent !== undefined) {
      setThreshold(settings.alertThresholdPercent);
    }
  }, [settings?.alertThresholdPercent]);

  const handleSave = async () => {
    await updateSettings.mutateAsync({ alertThresholdPercent: threshold });
    toast.success("Settings saved", {
      description: `Alert threshold set to ${threshold}%.`,
    });
    onClose();
  };

  const handleInputChange = (value: string) => {
    const n = Number(value);
    if (!Number.isNaN(n)) {
      setThreshold(Math.min(100, Math.max(50, n)));
    }
  };

  const sliderPct = ((threshold - 50) / 50) * 100;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl bg-card border border-border shadow-premium p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="font-display text-base font-semibold text-foreground leading-tight">
              Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">

          {/* ── Appearance ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Appearance
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Alert Threshold ── */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Budget Alerts
            </Label>

            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Warn me when a category reaches{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {threshold}%
              </span>{" "}
              of its monthly limit.
            </p>

            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold font-body text-foreground uppercase tracking-wide">
                  Alert Threshold
                </Label>
                <span className="font-mono text-sm font-bold text-primary tabular-nums">
                  {threshold}%
                </span>
              </div>

              <div className="relative h-5 flex items-center">
                <div className="absolute inset-y-0 top-1/2 -translate-y-1/2 w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-150"
                    style={{ width: `${sliderPct}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="relative w-full h-2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:cursor-pointer"
                  aria-label="Alert threshold percentage"
                />
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono tabular-nums px-0.5">
                {[50, 60, 70, 80, 90, 100].map((v) => (
                  <span key={v}>{v}%</span>
                ))}
              </div>
            </div>

            {/* Direct input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="threshold-input"
                className="text-xs font-semibold font-body text-foreground uppercase tracking-wide"
              >
                Or enter directly (50–100)
              </Label>
              <Input
                id="threshold-input"
                type="number"
                min={50}
                max={100}
                step={5}
                value={threshold}
                onChange={(e) => handleInputChange(e.target.value)}
                className="h-9 font-mono text-sm rounded-xl"
              />
            </div>

            {threshold >= 90 && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 dark:text-amber-400 font-body">
                  At {threshold}%, you'll only be alerted very close to the limit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-2.5 justify-end border-t border-border pt-4 bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 rounded-xl font-body"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="h-9 px-5 rounded-xl font-body shadow-elevated button-hover"
          >
            {updateSettings.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
