import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Book, Category } from "@/types/library";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Book | null;
  categories: Category[];
  onSubmit: (data: Omit<Book, "id" | "available"> & { available?: number }) => void;
};

export function BookFormDialog({ open, onOpenChange, initial, categories, onSubmit }: Props) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial }
      : {
          title: "",
          author: "",
          isbn: "",
          categoryId: categories[0]?.id ?? "",
          publisher: "",
          year: new Date().getFullYear(),
          total: 1,
          available: 1,
        }
  );

  // reset when opening
  const handleOpen = (o: boolean) => {
    if (o) {
      setForm(
        initial
          ? { ...initial }
          : {
              title: "",
              author: "",
              isbn: "",
              categoryId: categories[0]?.id ?? "",
              publisher: "",
              year: new Date().getFullYear(),
              total: 1,
              available: 1,
            }
      );
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Sửa sách" : "Thêm sách mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tên sách</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Tác giả</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>ISBN</Label>
              <Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Thể loại</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Nhà xuất bản</Label>
              <Input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Năm XB</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Số lượng</Label>
              <Input
                type="number"
                min={1}
                value={form.total}
                onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
              />
            </div>
            {initial && (
              <div className="grid gap-2">
                <Label>Còn lại</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.available}
                  onChange={(e) => setForm({ ...form, available: Number(e.target.value) })}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={() => {
              onSubmit(form);
              onOpenChange(false);
            }}
            disabled={!form.title || !form.author || !form.categoryId}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
