import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BookTemplate,
  CalendarDays,
  Check,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { useBudgets, useMonthlySummary } from "../hooks/useBudget";
import {
  type BudgetTemplate,
  useApplyBudgetTemplate,
  useCreateBudgetTemplate,
  useDeleteBudgetTemplate,
  useListBudgetTemplates,
  useUpdateBudgetTemplate,
} from "../hooks/useTemplates";
import { CATEGORY_ICONS, formatCents, getMonthName } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function templateTotalCents(tpl: BudgetTemplate): number {
  return tpl.categories.reduce((sum, c) => sum + Number(c.limitCents), 0);
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Save Current Budget Dialog ───────────────────────────────────────────────

function SaveBudgetDialog({
  open,
  onOpenChange,
  year,
  month,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  year: number;
  month: number;
}) {
  const [name, setName] = useState("");
  const { data: summary, isLoading } = useMonthlySummary(year, month);
  const createTemplate = useCreateBudgetTemplate();

  const budgets = summary?.budgets ?? [];

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Please enter a template name.");
      return;
    }
    if (budgets.length === 0) {
      toast.error("No budget categories to save for this month.");
      return;
    }
    try {
      await createTemplate.mutateAsync({
        name: name.trim(),
        categories: budgets.map((bs) => ({
          name: bs.budget.name,
          limitCents: bs.budget.limitCents,
          color: bs.budget.color,
          category: bs.budget.category,
        })),
      });
      toast.success("Template saved!", {
        description: `"${name.trim()}" is ready to reuse.`,
      });
      setName("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save template. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="save_template.dialog"
        className="max-w-lg shadow-premium"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Save size={18} />
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                Save Current Budget as Template
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {getMonthName(month)} {year} · {budgets.length} categories
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tpl-name" className="text-sm font-medium">
              Template name
            </Label>
            <Input
              id="tpl-name"
              placeholder="e.g. Monthly Essentials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              data-ocid="save_template.name_input"
              className="h-9"
              autoFocus
            />
          </div>

          {/* Category preview */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Categories to save
            </p>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((k) => (
                  <Skeleton key={k} className="h-9 rounded-lg" />
                ))}
              </div>
            ) : budgets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                No budgets found for {getMonthName(month)} {year}.
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {budgets.map((bs) => (
                  <li
                    key={bs.budget.id.toString()}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/50 border border-border/60"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-border/40"
                      style={{ background: bs.budget.color }}
                    />
                    <span className="text-sm">
                      {CATEGORY_ICONS[bs.budget.category] ?? "📦"}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground truncate">
                      {bs.budget.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                      {formatCents(bs.budget.limitCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2.5 justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              data-ocid="save_template.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={createTemplate.isPending || !name.trim()}
              data-ocid="save_template.submit_button"
              className="min-w-[110px]"
            >
              {createTemplate.isPending ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1.5" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Rename Dialog ────────────────────────────────────────────────────────────

function RenameDialog({
  template,
  onClose,
}: {
  template: BudgetTemplate | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const updateTemplate = useUpdateBudgetTemplate();

  async function handleRename() {
    if (!template || !name.trim()) return;
    try {
      await updateTemplate.mutateAsync({ id: template.id, name: name.trim() });
      toast.success("Template renamed successfully.");
      onClose();
    } catch {
      toast.error("Failed to rename template. Please try again.");
    }
  }

  return (
    <Dialog open={!!template} onOpenChange={() => onClose()}>
      <DialogContent
        data-ocid="rename_template.dialog"
        className="max-w-sm shadow-premium"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold">
            Rename Template
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter a new name for "{template?.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            data-ocid="rename_template.name_input"
            placeholder="Template name"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="rename_template.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRename}
              disabled={updateTemplate.isPending || !name.trim()}
              data-ocid="rename_template.save_button"
            >
              {updateTemplate.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Apply Confirmation Dialog ────────────────────────────────────────────────

function ApplyTemplateDialog({
  template,
  year,
  month,
  onClose,
}: {
  template: BudgetTemplate | null;
  year: number;
  month: number;
  onClose: () => void;
}) {
  const applyTemplate = useApplyBudgetTemplate();
  const navigate = useNavigate();

  async function handleApply() {
    if (!template) return;
    try {
      await applyTemplate.mutateAsync({
        templateId: template.id,
        year,
        month,
      });
      toast.success("Template applied!", {
        description: `Budgets for ${getMonthName(month)} ${year} are ready.`,
      });
      onClose();
      navigate({ to: "/budgets" });
    } catch {
      toast.error("Failed to apply template. Please try again.");
    }
  }

  return (
    <Dialog open={!!template} onOpenChange={() => onClose()}>
      <DialogContent
        data-ocid="apply_template.dialog"
        className="max-w-sm shadow-premium"
      >
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Check size={18} />
          </div>
          <DialogTitle className="font-display text-base font-bold">
            Apply Template
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            This will create new budgets for{" "}
            <strong className="text-foreground">
              {getMonthName(month)} {year}
            </strong>{" "}
            using template{" "}
            <strong className="text-foreground">"{template?.name}"</strong>.
            Continue?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="apply_template.cancel_button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={applyTemplate.isPending}
            data-ocid="apply_template.confirm_button"
            className="min-w-[90px]"
          >
            {applyTemplate.isPending ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Applying…
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  index,
  onApply,
  onRename,
  onDelete,
}: {
  template: BudgetTemplate;
  index: number;
  onApply: (tpl: BudgetTemplate) => void;
  onRename: (tpl: BudgetTemplate) => void;
  onDelete: (tpl: BudgetTemplate) => void;
}) {
  const preview = template.categories.slice(0, 3);
  const extra = template.categories.length - 3;
  const totalCents = templateTotalCents(template);

  return (
    <article
      data-ocid={`templates.item.${index}`}
      className="group flex flex-col bg-card border border-border/60 rounded-xl shadow-subtle hover:shadow-elevated transition-shadow duration-200 overflow-hidden"
    >
      {/* Header stripe */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-[0.9375rem] text-foreground truncate leading-tight">
            {template.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <CalendarDays size={11} />
            Saved {formatDate(template.createdAt)}
          </p>
        </div>
        <Badge
          variant="secondary"
          className="flex-shrink-0 text-xs font-mono bg-muted/60 text-muted-foreground"
        >
          {template.categories.length} categories
        </Badge>
      </div>

      {/* Category previews */}
      <div className="px-4 pb-3 flex-1">
        <ul className="space-y-1">
          {preview.map((cat) => (
            <li
              key={cat.name}
              className="flex items-center gap-2 text-sm text-foreground/80"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: cat.color }}
              />
              <span className="text-xs">
                {CATEGORY_ICONS[cat.category] ?? "📦"}
              </span>
              <span className="truncate text-[0.8125rem]">{cat.name}</span>
            </li>
          ))}
          {extra > 0 && (
            <li className="text-xs text-muted-foreground pl-4">
              +{extra} more…
            </li>
          )}
        </ul>
      </div>

      {/* Total */}
      <div className="px-4 py-2.5 border-t border-border/40 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Total limit:{" "}
          <span className="font-mono font-semibold text-foreground">
            {formatCents(totalCents)}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-t border-border/40">
        <Button
          size="sm"
          onClick={() => onApply(template)}
          data-ocid={`templates.apply_button.${index}`}
          className="flex-1 h-8 text-xs font-medium"
        >
          <Layers size={13} className="mr-1.5" />
          Load Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRename(template)}
          data-ocid={`templates.rename_button.${index}`}
          className="h-8 w-8 p-0"
          aria-label="Rename template"
        >
          <Pencil size={13} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(template)}
          data-ocid={`templates.delete_button.${index}`}
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
          aria-label="Delete template"
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </article>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function TemplatesPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: templates, isLoading } = useListBudgetTemplates();
  // Preload budgets for the save dialog
  useBudgets(year, month);

  const [saveOpen, setSaveOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<BudgetTemplate | null>(null);
  const [applyTarget, setApplyTarget] = useState<BudgetTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetTemplate | null>(null);

  const deleteTemplate = useDeleteBudgetTemplate();

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTemplate.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete template. Please try again.");
    }
  }

  return (
    <div className="min-h-full bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-subtle">
              <BookTemplate size={18} />
            </div>
            <div>
              <h1
                className="font-display text-xl font-bold text-foreground tracking-tight"
                data-ocid="templates.page"
              >
                Budget Templates
              </h1>
              <p className="text-sm text-muted-foreground">
                Save your budget setup and reuse it in future months.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setSaveOpen(true)}
            data-ocid="templates.save_current_button"
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={15} />
            Save Current Budget
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="templates.loading_state"
          >
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : !templates || templates.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
            data-ocid="templates.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-subtle">
              <BookTemplate size={28} />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-2">
              No templates yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Save your current month's budget categories as a reusable template
              so you can apply them to any future month in seconds.
            </p>
            <Button
              onClick={() => setSaveOpen(true)}
              data-ocid="templates.empty_save_button"
              className="flex items-center gap-2"
            >
              <Save size={15} />
              Save Current Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl, i) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                index={i + 1}
                onApply={setApplyTarget}
                onRename={setRenameTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SaveBudgetDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        year={year}
        month={month}
      />

      <RenameDialog
        template={renameTarget}
        onClose={() => setRenameTarget(null)}
      />

      <ApplyTemplateDialog
        template={applyTarget}
        year={year}
        month={month}
        onClose={() => setApplyTarget(null)}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Template"
        description={`"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteTemplate.isPending}
      />
    </div>
  );
}
