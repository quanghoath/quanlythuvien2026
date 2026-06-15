import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { Sach } from "@/types/library";

export const Route = createFileRoute("/sach")({ component: Page });

type FormState = {
  TenSach: string;
  MaTacGia: number;
  MaTheLoai: number;
  NamXuatBan: number | "";
  SoLuong: number;
  SoLuongCon: number;
};

function Page() {
  const { sach, tacGia, theLoai, addSach, updateSach, deleteSach } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sach | null>(null);
  const [form, setForm] = useState<FormState>({
    TenSach: "", MaTacGia: 0, MaTheLoai: 0, NamXuatBan: new Date().getFullYear(), SoLuong: 1, SoLuongCon: 1,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      TenSach: "", MaTacGia: tacGia[0]?.MaTacGia ?? 0, MaTheLoai: theLoai[0]?.MaTheLoai ?? 0,
      NamXuatBan: new Date().getFullYear(), SoLuong: 1, SoLuongCon: 1,
    });
    setOpen(true);
  };
  const openEdit = (r: Sach) => {
    setEditing(r);
    setForm({
      TenSach: r.TenSach, MaTacGia: r.MaTacGia, MaTheLoai: r.MaTheLoai,
      NamXuatBan: r.NamXuatBan ?? "", SoLuong: r.SoLuong, SoLuongCon: r.SoLuongCon,
    });
    setOpen(true);
  };

  const submit = () => {
    if (!form.TenSach.trim() || !form.MaTacGia || !form.MaTheLoai) return toast.error("Vui lòng điền đủ thông tin");
    if (form.SoLuong < 0 || form.SoLuongCon < 0 || form.SoLuongCon > form.SoLuong) return toast.error("Số lượng không hợp lệ");
    const payload = {
      TenSach: form.TenSach.trim(),
      MaTacGia: form.MaTacGia,
      MaTheLoai: form.MaTheLoai,
      NamXuatBan: form.NamXuatBan === "" ? null : Number(form.NamXuatBan),
      SoLuong: Number(form.SoLuong),
      SoLuongCon: Number(form.SoLuongCon),
    };
    if (editing) { updateSach(editing.MaSach, payload); toast.success("Đã cập nhật"); }
    else { addSach(payload); toast.success("Đã thêm"); }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Sách"
        description="Quản lý kho sách của thư viện."
        data={sach}
        getId={(r) => r.MaSach}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaSach, className: "w-16" },
          { key: "t", header: "Tên sách", render: (r) => <span className="font-medium">{r.TenSach}</span> },
          { key: "a", header: "Tác giả", render: (r) => tacGia.find((x) => x.MaTacGia === r.MaTacGia)?.TenTacGia ?? "—" },
          { key: "c", header: "Thể loại", render: (r) => theLoai.find((x) => x.MaTheLoai === r.MaTheLoai)?.TenTheLoai ?? "—" },
          { key: "y", header: "Năm XB", render: (r) => r.NamXuatBan ?? "—", className: "w-20" },
          { key: "sl", header: "Tổng / Còn", render: (r) => (
            <Badge variant={r.SoLuongCon === 0 ? "destructive" : "secondary"}>{r.SoLuong} / {r.SoLuongCon}</Badge>
          ), className: "w-32" },
        ]}
        searchFilter={(r, q) => r.TenSach.toLowerCase().includes(q)}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => { deleteSach(r.MaSach); toast.success("Đã xoá"); }}
        onExport={() => exportToCSV("sach", sach.map((s) => ({
          MaSach: s.MaSach, TenSach: s.TenSach,
          TacGia: tacGia.find((x) => x.MaTacGia === s.MaTacGia)?.TenTacGia ?? "",
          TheLoai: theLoai.find((x) => x.MaTheLoai === s.MaTheLoai)?.TenTheLoai ?? "",
          NamXuatBan: s.NamXuatBan ?? "", SoLuong: s.SoLuong, SoLuongCon: s.SoLuongCon,
        })))}
      />
      <FormDialog open={open} onOpenChange={setOpen} title={editing ? "Sửa sách" : "Thêm sách"} onSubmit={submit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Tên sách</Label>
            <Input value={form.TenSach} onChange={(e) => setForm({ ...form, TenSach: e.target.value })} autoFocus />
          </div>
          <div className="space-y-2">
            <Label>Tác giả</Label>
            <Select value={String(form.MaTacGia)} onValueChange={(v) => setForm({ ...form, MaTacGia: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="Chọn tác giả" /></SelectTrigger>
              <SelectContent>{tacGia.map((t) => <SelectItem key={t.MaTacGia} value={String(t.MaTacGia)}>{t.TenTacGia}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Thể loại</Label>
            <Select value={String(form.MaTheLoai)} onValueChange={(v) => setForm({ ...form, MaTheLoai: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="Chọn thể loại" /></SelectTrigger>
              <SelectContent>{theLoai.map((t) => <SelectItem key={t.MaTheLoai} value={String(t.MaTheLoai)}>{t.TenTheLoai}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Năm xuất bản</Label>
            <Input type="number" value={form.NamXuatBan} onChange={(e) => setForm({ ...form, NamXuatBan: e.target.value === "" ? "" : Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Số lượng</Label>
            <Input type="number" min={0} value={form.SoLuong} onChange={(e) => setForm({ ...form, SoLuong: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Số lượng còn</Label>
            <Input type="number" min={0} value={form.SoLuongCon} onChange={(e) => setForm({ ...form, SoLuongCon: Number(e.target.value) })} />
          </div>
        </div>
      </FormDialog>
    </>
  );
}
