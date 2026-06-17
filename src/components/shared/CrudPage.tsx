import { useState, type ReactNode } from "react";
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
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
}: Props<T>) {
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<T | null>(null);

  const filtered =
    searchFilter && q.trim() ? data.filter((r) => searchFilter(r, q.trim().toLowerCase())) : data;

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

      {searchFilter && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-28 text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={getId(row)}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
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
      </div>

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
