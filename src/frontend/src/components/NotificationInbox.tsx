import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "../hooks/useNotifications";

const SEVERITY_CLASSES: Record<string, string> = {
  danger: "border-destructive/25 bg-destructive/8",
  warning: "border-amber-500/25 bg-amber-500/8",
  info: "border-border bg-muted/30",
};

export function NotificationInbox({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const { notifications, dismiss, dismissAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={
            triggerClassName ??
            "w-full flex items-center justify-between text-[0.8125rem] text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-xl h-9 px-3 font-medium transition-colors"
          }
        >
          <span>Alerts</span>
          {notifications.length > 0 && (
            <Badge
              variant="outline"
              className="text-[11px] font-bold px-1.5 py-0 rounded-full border bg-warning/10 text-warning border-warning/30 font-mono"
            >
              {notifications.length}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 max-w-[calc(100vw-2rem)] p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-sm font-semibold font-display text-foreground leading-none">
            Alerts
          </p>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={dismissAll}
              className="text-[12px] text-primary hover:underline -m-2 p-2"
            >
              Dismiss all
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-xs text-muted-foreground px-4 py-6 text-center">
            Nothing needs your attention right now.
          </p>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="divide-y divide-border/60">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-l-2 ${SEVERITY_CLASSES[n.severity]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground leading-snug">
                      {n.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex-shrink-0 -m-1.5 p-1.5"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
