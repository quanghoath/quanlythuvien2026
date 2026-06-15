import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { PhieuTra } from "@/types/library";

export const Route = createFileRoute("/phieu-tra")({ component: Page });

const today = () => new Date().toISOString().slice(0, 10);
const fmtMoney = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

function Page() {
  const { phieuTra, phieuMuon, docGia, addPhieuTra, updatePhieuTra, deletePhieuTra } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PhieuTra | null>(null);
  const [form, setForm] = useState({ MaPhieuMuon: 0, NgayTra: today(), TienPhat: 0 });

  // Phiếu mượn chưa có phiếu trả
  const dsPhieuChuaTra = useMemo(
    () => phieuMuon.filter((pm) => !phieuTra.some((pt) => pt.MaPhieuMuon === pm.MaPhieuMuon)),
    [phieuMuon, phieuTra]
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ MaPhieuMuon: dsPhieuChuaTra[0]?.MaPhieuMuon ?? 0, NgayTra: today(), TienPhat: 0 });
    setOpen(true);
  };
  const openEdit = (r: PhieuTra) => {
    setEditing(r);
    setForm({ MaPhieuMuon: r.MaPhieuMuon, NgayTra: r.NgayTra, TienPhat: r.TienPhat });
    setOpen(true);
  };

  const submit = () => {
    if (!form.MaPhieuMuon) return toast.error("Chọn phiếu mượn");
    if (editing) { updatePhieuTra(editing.MaPhieuTra, form); toast.success("Đã cập nhật"); }
    else { addPhieuTra(form); toast.success("Đã ghi nhận trả sách"); }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Phiếu trả"
        description="Ghi nhận trả sách và tính tiền phạt nếu quá hạn."
        data={phieuTra}
        getId={(r) => r.MaPhieuTra}
        columns={[
          { key: "id", header: "Mã", render: (r) => `#${r.MaPhieuTra}`, className: "w-20" },
          { key: "pm", header: "Phiếu mượn", render: (r) => `#${r.MaPhieuMuon}`, className: "w-28" },
          { key: "dg", header: "Độc giả", render: (r) => {
            const pm = phieuMuon.find((x) => x.MaPhieuMuon === r.MaPhieuMuon);
            return docGia.find((d) => d.MaDocGia === pm?.MaDocGia)?.HoTen ?? "—";
          } },
          { key: "nt", header: "Ngày trả", render: (r) => r.NgayTra, className: "w-32" },
          { key: "tp", header: "Tiền phạt", render: (r) => fmtMoney(r.TienPhat), className: "w-36 text-right" },
        ]}
        searchFilter={(r, q) => String(r.MaPhieuMuon).includes(q) || String(r.MaPhieuTra).includes(q)}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => { deletePhieuTra(r.MaPhieuTra); toast.success("Đã xoá"); }}
        onExport={() => exportToCSV("phieu-tra", phieuTra.map((r) => ({
          MaPhieuTra: r.MaPhieuTra, MaPhieuMuon: r.MaPhieuMuon, NgayTra: r.NgayTra, TienPhat: r.TienPhat,
        })))}
      />

      <FormDialog open={open} onOpenChange={setOpen} title={editing ? "Sửa phiếu trả" : "Thêm phiếu trả"} onSubmit={submit}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Phiếu mượn</Label>
            <Select value={String(form.MaPhieuMuon)} onValueChange={(v) => setForm({ ...form, MaPhieuMuon: Number(v) })} disabled={!!editing}>
              <SelectTrigger><SelectValue placeholder="Chọn phiếu mượn" /></SelectTrigger>
              <SelectContent>
                {(editing ? phieuMuon : dsPhieuChuaTra).map((pm) => {
                  const dn = docGia.find((d) => d.MaDocGia === pm.MaDocGia)?.HoTen ?? "—";
                  return <SelectItem key={pm.MaPhieuMuon} value={String(pm.MaPhieuMuon)}>#{pm.MaPhieuMuon} · {dn} · hạn {pm.HanTra}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày trả</Label>
              <Input type="date" value={form.NgayTra} onChange={(e) => setForm({ ...form, NgayTra: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tiền phạt (VND)</Label>
              <Input type="number" min={0} value={form.TienPhat} onChange={(e) => setForm({ ...form, TienPhat: Number(e.target.value) })} />
            </div>
          </div>
        </div>
      </FormDialog>
    </>
  );
}
