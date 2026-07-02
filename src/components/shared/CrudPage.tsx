import { useMemo, useState, type ReactNode } from "react";
import { Plus, Pencil, Trash2, Download, Search, Inbox, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  getId: (row: T) => number;
  searchFilter?: (row: T, q: string) => boolean;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onExport?: () => void;
  extraActions?: ReactNode;
  editIcon?: ReactNode;
  summary?: Array<{ label: string; value: ReactNode; hint?: string }>;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function CrudPage<T>({
  title,
  description,
  data,
  columns,
  getId,
  searchFilter,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  extraActions,
  editIcon,
  summary,
  searchPlaceholder = "Tìm kiếm dữ liệu...",
  emptyTitle = "Chưa có dữ liệu",
  emptyDescription = "Dữ liệu sẽ xuất hiện ở đây khi bạn bắt đầu thêm mới hoặc đồng bộ từ hệ thống.",
}: Props<T>) {
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<T | null>(null);

  const filtered =
    searchFilter && q.trim() ? data.filter((r) => searchFilter(r, q.trim().toLowerCase())) : data;
  const stats = useMemo(
    () =>
      (summary ?? []).map((item) => ({
        ...item,
        value:
          typeof item.value === "number"
            ? new Intl.NumberFormat("vi-VN").format(item.value)
            : item.value,
      })),
    [summary],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {extraActions}
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" /> Xuất CSV
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" /> Thêm mới
              </Button>
            )}
          </>
        }
      />

      {stats.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="border-border/75">
              <CardContent className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </p>
                {item.hint && (
                  <p className="text-xs leading-5 text-muted-foreground">{item.hint}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="overflow-hidden border-border/75">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-border/70 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Rows3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Danh sách {title.toLowerCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filtered.length} / {data.length} bản ghi hiển thị
                </p>
              </div>
            </div>
            {searchFilter && (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.header}
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="w-28 text-right">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="px-4 py-14">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-base font-semibold text-foreground">{emptyTitle}</p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        {emptyDescription}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={getId(row)}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={cn("text-sm", c.className)}>
                        {c.render(row)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <Button size="icon" variant="ghost" onClick={() => onEdit(row)}>
                              {editIcon ?? <Pencil className="h-4 w-4" />}
                            </Button>
                          )}
                          {onDelete && (
                            <Button size="icon" variant="ghost" onClick={() => setToDelete(row)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={() => {
          if (toDelete && onDelete) onDelete(toDelete);
          setToDelete(null);
        }}
      />
    </div>
  );
}
