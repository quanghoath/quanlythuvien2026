import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Tag } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Category } from "@/types/library";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({ meta: [{ title: "Thể loại – Quản lý thư viện" }] }),
});

function CategoriesPage() {
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibrary();
  const [editing, setEditing] = useState<Category | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (openForm) setForm(editing ?? { name: "", description: "" });
  }, [openForm, editing]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    books.forEach((b) => m.set(b.categoryId, (m.get(b.categoryId) ?? 0) + 1));
    return m;
  }, [books]);

  const handleExport = () => {
    exportToCSV(
      `the-loai-${new Date().toISOString().slice(0, 10)}`,
      categories.map((c) => ({ ...c, bookCount: counts.get(c.id) ?? 0 })),
      [
        { key: "id", label: "Mã" },
        { key: "name", label: "Tên" },
        { key: "description", label: "Mô tả" },
        { key: "bookCount", label: "Số đầu sách" },
      ]
    );
    toast.success("Đã xuất file CSV");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thể loại sách"
        description={`${categories.length} thể loại`}
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Xuất CSV
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm thể loại
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id} className="group transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/40 text-accent-foreground">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{counts.get(c.id) ?? 0} đầu sách</p>
                  </div>
                </div>
                <div className="opacity-0 transition group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(c);
                      setOpenForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(c.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa thể loại" : "Thêm thể loại"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Tên thể loại</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Huỷ
            </Button>
            <Button
              disabled={!form.name}
              onClick={() => {
                if (editing) {
                  updateCategory(editing.id, form);
                  toast.success("Đã cập nhật");
                } else {
                  addCategory(form);
                  toast.success("Đã thêm thể loại");
                }
                setOpenForm(false);
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xoá thể loại?"
        description="Sách thuộc thể loại này sẽ không còn được phân loại."
        onConfirm={() => {
          if (deleteId) {
            deleteCategory(deleteId);
            toast.success("Đã xoá");
          }
        }}
      />
    </div>
  );
}
