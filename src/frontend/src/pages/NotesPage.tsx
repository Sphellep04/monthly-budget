import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, FileText, Plus, StickyNote, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateNote,
  useDeleteNote,
  useListNotes,
  useUpdateNote,
} from "../hooks/useBudget";
import type { Note } from "../types";

/* ─── Helpers ─── */
function formatNoteDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/* ─── Note Modal ─── */
function NoteModal({
  open,
  onClose,
  editNote,
}: {
  open: boolean;
  onClose: () => void;
  editNote?: Note;
}) {
  const [title, setTitle] = useState(editNote?.title ?? "");
  const [content, setContent] = useState(editNote?.content ?? "");
  const [error, setError] = useState("");
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  // Reset form when modal opens/closes or editNote changes
  const resetForm = () => {
    setTitle(editNote?.title ?? "");
    setContent(editNote?.content ?? "");
    setError("");
  };

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    try {
      if (editNote) {
        await updateNote.mutateAsync({
          id: editNote.id,
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note updated");
      } else {
        await createNote.mutateAsync({
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note created");
      }
      handleClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (!open) return null;

  const isPending = createNote.isPending || updateNote.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        role="button"
        tabIndex={0}
        aria-label="Close"
        onClick={handleClose}
        onKeyDown={(e) => e.key === "Enter" && handleClose()}
      />
      <motion.div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-premium p-6 space-y-5 z-10"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <StickyNote size={15} className="text-primary" />
            </div>
            <h2 className="font-display text-base font-semibold text-foreground">
              {editNote ? "Edit Note" : "New Note"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="note-title"
              className="text-xs font-semibold text-foreground"
            >
              Title
            </Label>
            <Input
              id="note-title"
              placeholder="Note title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg"
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="note-content"
              className="text-xs font-semibold text-foreground"
            >
              Content
            </Label>
            <Textarea
              id="note-content"
              placeholder="Write your note here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="rounded-lg resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Saving…
                </span>
              ) : editNote ? (
                "Save changes"
              ) : (
                "Create note"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Note Card ─── */
function NoteCard({
  note,
  index,
  onEdit,
  onDelete,
}: {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}) {
  return (
    <motion.div
      className="group relative rounded-2xl border border-border bg-card p-5 shadow-subtle card-hover space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(note)}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Edit note"
        >
          <Edit2 size={13} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(note)}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete note"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1.5 pr-16">
        <h3 className="font-display text-sm font-semibold text-foreground leading-snug truncate">
          {note.title}
        </h3>
        {note.content && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {truncate(note.content, 200)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <FileText size={11} className="text-muted-foreground/50 shrink-0" />
        <span className="text-[10px] text-muted-foreground/70 truncate">
          Updated {formatNoteDate(note.updatedAt)}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Notes Page ─── */
export function NotesPage() {
  const { data: notes, isLoading } = useListNotes();
  const deleteNote = useDeleteNote();

  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Note | undefined>(undefined);

  function openCreate() {
    setEditNote(undefined);
    setModalOpen(true);
  }

  function openEdit(note: Note) {
    setEditNote(note);
    setModalOpen(true);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteNote.mutate(deleteTarget.id, {
      onSuccess: () => toast.success("Note deleted"),
      onError: () => toast.error("Failed to delete note"),
    });
    setDeleteTarget(undefined);
  }

  const sortedNotes = (notes ?? [])
    .slice()
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));

  return (
    <>
      <motion.div
        className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StickyNote className="w-4 h-4 text-primary opacity-70" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Notes
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
              My Notes
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
              Jot down financial goals, monthly reflections, or anything on your
              mind.
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2 shrink-0 mt-1">
            <Plus size={15} />
            New Note
          </Button>
        </div>

        {/* ── Notes Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
              <div
                key={k}
                className="rounded-2xl border border-border bg-card p-5 space-y-3"
              >
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : sortedNotes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <StickyNote className="w-8 h-8 text-primary opacity-60" />
            </div>
            <p className="font-display text-base font-semibold text-foreground mb-2">
              No notes yet
            </p>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              Create your first note — track financial goals, reminders, or
              monthly reflections.
            </p>
            <Button onClick={openCreate} className="gap-2">
              <Plus size={15} />
              Create your first note
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNotes.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={i + 1}
                  onEdit={openEdit}
                  onDelete={(n) => setDeleteTarget(n)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* ── Note Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <NoteModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditNote(undefined);
            }}
            editNote={editNote}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently deleted. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
