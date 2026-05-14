import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Member } from "@/types/library";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Member | null;
  onSubmit: (data: Omit<Member, "id">) => void;
};

const empty: Omit<Member, "id"> = {
  name: "",
  email: "",
  phone: "",
  joinedAt: new Date().toISOString().slice(0, 10),
  status: "active",
};

export function MemberFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Member, "id">>(empty);

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : empty);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Sửa độc giả" : "Thêm độc giả"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Họ tên</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Số điện thoại</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Ngày tham gia</Label>
              <Input type="date" value={form.joinedAt} onChange={(e) => setForm({ ...form, joinedAt: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            disabled={!form.name || !form.email}
            onClick={() => {
              onSubmit(form);
              onOpenChange(false);
            }}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
