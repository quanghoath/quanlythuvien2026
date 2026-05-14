import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Book, Member } from "@/types/library";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  books: Book[];
  members: Member[];
  onSubmit: (data: { bookId: string; memberId: string; borrowedAt: string; dueAt: string }) => void;
};

export function LoanFormDialog({ open, onOpenChange, books, members, onSubmit }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 14);
  const dueStr = due.toISOString().slice(0, 10);

  const [form, setForm] = useState({
    bookId: "",
    memberId: "",
    borrowedAt: today,
    dueAt: dueStr,
  });

  useEffect(() => {
    if (open) {
      setForm({
        bookId: books.find((b) => b.available > 0)?.id ?? "",
        memberId: members[0]?.id ?? "",
        borrowedAt: today,
        dueAt: dueStr,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo phiếu mượn</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Sách</Label>
            <Select value={form.bookId} onValueChange={(v) => setForm({ ...form, bookId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn sách" />
              </SelectTrigger>
              <SelectContent>
                {books.map((b) => (
                  <SelectItem key={b.id} value={b.id} disabled={b.available === 0}>
                    {b.title} {b.available === 0 ? "(hết)" : `(còn ${b.available})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Độc giả</Label>
            <Select value={form.memberId} onValueChange={(v) => setForm({ ...form, memberId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn độc giả" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Ngày mượn</Label>
              <Input type="date" value={form.borrowedAt} onChange={(e) => setForm({ ...form, borrowedAt: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Hạn trả</Label>
              <Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            disabled={!form.bookId || !form.memberId}
            onClick={() => {
              onSubmit(form);
              onOpenChange(false);
            }}
          >
            Tạo phiếu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
