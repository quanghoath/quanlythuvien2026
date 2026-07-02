import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warning" | "destructive";
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/18 text-success",
  warning: "bg-warning/25 text-warning-foreground",
  destructive: "bg-destructive/12 text-destructive",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "default" }: Props) {
  return (
    <Card className="overflow-hidden border-border/75">
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 shadow-sm",
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold leading-none tracking-tight text-foreground">
            {value}
          </p>
          {hint && <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
