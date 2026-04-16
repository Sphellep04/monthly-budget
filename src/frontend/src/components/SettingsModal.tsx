import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateUserSettings, useUserSettings } from "../hooks/useBudget";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const [threshold, setThreshold] = useState(80);

  // Sync with fetched settings when available
  useEffect(() => {
    if (settings?.alertThresholdPercent !== undefined) {
      setThreshold(settings.alertThresholdPercent);
    }
  }, [settings?.alertThresholdPercent]);

  const handleSave = async () => {
    await updateSettings.mutateAsync({ alertThresholdPercent: threshold });
    toast.success("Alert threshold saved", {
      description: `You'll be warned when a category reaches ${threshold}% of its limit.`,
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
      <DialogContent
        className="max-w-sm rounded-2xl bg-card border border-border shadow-premium p-0 overflow-hidden"
        data-ocid="settings.dialog"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-4.5 w-4.5 text-primary" />
            </div>
            <DialogTitle className="font-display text-base font-semibold text-foreground leading-tight">
              Budget Alert Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Explanation */}
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            You'll be warned when a category reaches{" "}
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

            {/* Custom styled range slider */}
            <div
              className="relative h-5 flex items-center"
              data-ocid="settings.threshold_slider"
            >
              {/* Track background */}
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

            {/* Tick marks */}
            <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono tabular-nums px-0.5">
              {[50, 60, 70, 80, 90, 100].map((v) => (
                <span key={v}>{v}%</span>
              ))}
            </div>
          </div>

          {/* Number input */}
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
              data-ocid="settings.threshold_input"
            />
          </div>

          {/* Warning hint */}
          {threshold >= 90 && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-warning/8 border border-warning/20">
              <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning/90 font-body">
                At {threshold}%, you'll only be alerted very close to the limit.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-2.5 justify-end border-t border-border pt-4 bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 rounded-xl font-body"
            data-ocid="settings.cancel_button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="h-9 px-5 rounded-xl font-body shadow-elevated button-hover"
            data-ocid="settings.save_button"
          >
            {updateSettings.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
