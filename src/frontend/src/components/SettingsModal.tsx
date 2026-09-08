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
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { useAuth } from "../hooks/useAuth";
import {
  getNotificationPermission,
  getNotificationsEnabled,
  requestNotificationPermission,
  setNotificationsEnabled,
} from "../hooks/useBillReminders";
import {
  useCategories,
  useCategoryRules,
  useCreateCategory,
  useDeleteCategory,
  useDeleteCategoryRule,
  useExportData,
  useImportData,
  useUpdateUserSettings,
  useUserSettings,
} from "../hooks/useBudget";
import { useUndoableDelete } from "../hooks/useUndoableDelete";
import { CATEGORIES } from "../types";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { deleteAccount } = useAuth();
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();
  const { theme, setTheme } = useTheme();
  const exportData = useExportData();
  const importData = useImportData();
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: customCategories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { requestDelete: requestDeleteCategory, isPending: isCategoryPending } =
    useUndoableDelete<bigint>((id) => {
      deleteCategory.mutate(id, {
        onError: () => toast.error("Failed to delete category"),
      });
    });
  const [newCategory, setNewCategory] = useState("");

  const { data: categoryRules = [] } = useCategoryRules();
  const deleteCategoryRule = useDeleteCategoryRule();
  const { requestDelete: requestDeleteRule, isPending: isRulePending } =
    useUndoableDelete<bigint>((id) => {
      deleteCategoryRule.mutate(id, {
        onError: () => toast.error("Failed to remove rule"),
      });
    });

  const [threshold, setThreshold] = useState(80);
  const [floorStr, setFloorStr] = useState("");
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

  async function handleAddCategory() {
    const name = newCategory.trim();
    if (!name) return;
    if (
      CATEGORIES.includes(name) ||
      customCategories.some((c) => c.name === name)
    ) {
      toast.error("That category already exists");
      return;
    }
    try {
      await createCategory.mutateAsync(name);
      setNewCategory("");
      toast.success(`"${name}" added`);
    } catch {
      toast.error("Failed to add category");
    }
  }

  useEffect(() => {
    if (settings?.alertThresholdPercent !== undefined) {
      setThreshold(settings.alertThresholdPercent);
    }
  }, [settings?.alertThresholdPercent]);

  useEffect(() => {
    if (settings?.savingsFloorCents !== undefined) {
      setFloorStr(
        settings.savingsFloorCents > 0n
          ? (Number(settings.savingsFloorCents) / 100).toFixed(2)
          : "",
      );
    }
  }, [settings?.savingsFloorCents]);

  useEffect(() => {
    if (open) {
      setNotificationsEnabledState(getNotificationsEnabled());
    }
  }, [open]);

  async function handleToggleNotifications(next: boolean) {
    if (next) {
      const permission = await requestNotificationPermission();
      setNotificationsEnabled(true);
      setNotificationsEnabledState(true);
      if (permission === "granted") {
        toast.success("Bill reminders enabled");
      } else {
        toast.info("Bill reminders enabled", {
          description:
            "Browser notifications are blocked, so reminders will show as in-app alerts instead.",
        });
      }
    } else {
      setNotificationsEnabled(false);
      setNotificationsEnabledState(false);
    }
  }

  async function handleExport() {
    try {
      const json = await exportData.mutateAsync();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `budgetwise-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported");
    } catch {
      toast.error("Failed to export data");
    }
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const confirmed = window.confirm(
      "Importing will replace all current data in this browser with the contents of the backup file. Continue?",
    );
    if (!confirmed) return;

    try {
      const text = await file.text();
      await importData.mutateAsync(text);
      toast.success("Data imported successfully");
    } catch {
      toast.error(
        "Failed to import data. Make sure it's a valid BudgetWise backup file.",
      );
    }
  }

  async function handleDeleteAccount() {
    const { error } = await deleteAccount();
    if (error) {
      toast.error("Failed to delete account", { description: error });
      return;
    }
    setDeleteAccountOpen(false);
    onClose();
    toast.success("Account deleted");
  }

  const handleSave = async () => {
    const floor = Number.parseFloat(floorStr);
    const savingsFloorCents =
      floorStr && Number.isFinite(floor) && floor > 0
        ? BigInt(Math.round(floor * 100))
        : 0n;
    await updateSettings.mutateAsync({
      alertThresholdPercent: threshold,
      savingsFloorCents,
    });
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
          <DialogTitle className="font-display text-base font-semibold text-foreground leading-tight">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* ── Appearance ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Appearance
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
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
              <div className="px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-body">
                  At {threshold}%, you'll only be alerted very close to the
                  limit.
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Savings Floor ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Savings Floor
            </Label>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              A minimum you always want left over each month, separate from any
              budget. The Dashboard shows whether you're still protecting it.
              Leave blank to turn this off.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
                N$
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5000.00"
                value={floorStr}
                onChange={(e) => setFloorStr(e.target.value)}
                className="pl-9 h-9 font-mono text-sm rounded-xl"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Bill Reminders ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Bill Reminders
            </Label>
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-muted/40 border border-border/60">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Notify me about bills due soon
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getNotificationPermission() === "denied"
                    ? "Browser notifications blocked - will show as in-app alerts"
                    : "Checks for unpaid bills due within 3 days"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                aria-label="Notify me about bills due soon"
                onClick={() => handleToggleNotifications(!notificationsEnabled)}
                className={cn(
                  "relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-150",
                  notificationsEnabled
                    ? "bg-primary"
                    : "bg-muted-foreground/25",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-150",
                    notificationsEnabled && "translate-x-4",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Categories ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Custom Categories
            </Label>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Add your own budget categories alongside the built-in ones.
            </p>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                placeholder="e.g. Pet Care"
                className="h-9 text-sm rounded-xl"
                disabled={createCategory.isPending}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs shrink-0"
                onClick={handleAddCategory}
                disabled={createCategory.isPending || !newCategory.trim()}
              >
                Add
              </Button>
            </div>
            {customCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {customCategories
                  .filter((cat) => !isCategoryPending(cat.id))
                  .map((cat) => (
                    <span
                      key={cat.id.toString()}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-muted/60 border border-border/60 text-xs text-foreground"
                    >
                      {cat.name}
                      <button
                        type="button"
                        onClick={() => requestDeleteCategory(cat.id, cat.name)}
                        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-destructive/15 hover:text-destructive transition-colors"
                        aria-label={`Remove ${cat.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Learned Categories ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Learned Categories
            </Label>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Quick Add remembers which category you pick for a merchant. Remove
              a rule if it's suggesting the wrong one.
            </p>
            {categoryRules.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {categoryRules
                  .filter((rule) => !isRulePending(rule.id))
                  .map((rule) => (
                    <span
                      key={rule.id.toString()}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-muted/60 border border-border/60 text-xs text-foreground"
                    >
                      <span className="font-medium">{rule.keyword}</span>
                      <span className="text-muted-foreground">
                        → {rule.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => requestDeleteRule(rule.id, rule.keyword)}
                        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-destructive/15 hover:text-destructive transition-colors"
                        aria-label={`Remove rule for ${rule.keyword}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/70">
                Nothing learned yet — use Quick Add and pick a category to
                start.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Backup & Restore ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
              Backup & Restore
            </Label>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Your data is synced to your account, but it's still a good idea to
              keep your own copy. Export a backup file, or import one to restore
              it.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs"
                onClick={handleExport}
                disabled={exportData.isPending}
              >
                Export Data
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs"
                onClick={handleImportClick}
                disabled={importData.isPending}
              >
                Import Data
              </Button>
            </div>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* ── Danger Zone ── */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-destructive/70 uppercase tracking-[0.14em]">
              Danger Zone
            </Label>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Permanently delete your account and all of its data.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-xl text-xs border-destructive/30 text-destructive hover:bg-destructive/8 hover:text-destructive"
              onClick={() => setDeleteAccountOpen(true)}
            >
              Delete Account
            </Button>
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

      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        onConfirm={handleDeleteAccount}
      />
    </Dialog>
  );
}
