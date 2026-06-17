import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { PhieuMuon } from "@/types/library";

export const Route = createFileRoute("/phieu-muon")({ component: Page });

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

type LineItem = { MaSach: number; SoLuong: number };

function Page() {
  const {
    phieuMuon,
    docGia,
    sach,
    chiTietPhieuMuon,
    phieuTra,
    addPhieuMuon,
    updatePhieuMuon,
    deletePhieuMuon,
  } = useLibrary();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PhieuMuon | null>(null);
  const [form, setForm] = useState({ MaDocGia: 0, NgayMuon: today(), HanTra: addDays(14) });
  const [items, setItems] = useState<LineItem[]>([]);

  const rows = useMemo(
    () =>
      phieuMuon.map((pm) => {
        const ct = chiTietPhieuMuon.filter((c) => c.MaPhieuMuon === pm.MaPhieuMuon);
        const daTra = phieuTra.some((pt) => pt.MaPhieuMuon === pm.MaPhieuMuon);
        const quaHan = !daTra && pm.HanTra < today();
        return {
          ...pm,
          soSach: ct.reduce((s, c) => s + c.SoLuong, 0),
          trangThai: daTra ? "returned" : quaHan ? "overdue" : ("borrowing" as const),
        };
      }),
    [phieuMuon, chiTietPhieuMuon, phieuTra],
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ MaDocGia: docGia[0]?.MaDocGia ?? 0, NgayMuon: today(), HanTra: addDays(14) });
    setItems([]);
    setOpen(true);
  };
  const openEdit = (r: PhieuMuon) => {
    setEditing(r);
    setForm({ MaDocGia: r.MaDocGia, NgayMuon: r.NgayMuon, HanTra: r.HanTra });
    setItems(
      chiTietPhieuMuon
        .filter((c) => c.MaPhieuMuon === r.MaPhieuMuon)
        .map((c) => ({ MaSach: c.MaSach, SoLuong: c.SoLuong })),
    );
    setOpen(true);
  };

  const submit = () => {
    if (!form.MaDocGia) return toast.error("Chọn độc giả");
    if (form.HanTra < form.NgayMuon) return toast.error("Hạn trả phải >= ngày mượn");
    if (items.length === 0) return toast.error("Thêm ít nhất 1 sách");
    if (items.some((i) => !i.MaSach || i.SoLuong < 1)) return toast.error("Chi tiết không hợp lệ");

    if (editing) {
      updatePhieuMuon(editing.MaPhieuMuon, form, items);
      toast.success("Đã cập nhật");
    } else {
      addPhieuMuon(form, items);
      toast.success("Đã tạo phiếu mượn");
    }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Phiếu mượn"
        description="Quản lý phiếu mượn sách của độc giả."
        data={rows}
        getId={(r) => r.MaPhieuMuon}
        columns={[
          { key: "id", header: "Mã", render: (r) => `#${r.MaPhieuMuon}`, className: "w-20" },
          {
            key: "d",
            header: "Độc giả",
            render: (r) => docGia.find((d) => d.MaDocGia === r.MaDocGia)?.HoTen ?? "—",
          },
          { key: "nm", header: "Ngày mượn", render: (r) => r.NgayMuon, className: "w-32" },
          { key: "ht", header: "Hạn trả", render: (r) => r.HanTra, className: "w-32" },
          { key: "sl", header: "Số sách", render: (r) => r.soSach, className: "w-24" },
          {
            key: "tt",
            header: "Trạng thái",
            render: (r) => (
              <Badge
                variant={
                  r.trangThai === "overdue"
                    ? "destructive"
                    : r.trangThai === "returned"
                      ? "secondary"
                      : "default"
                }
              >
                {r.trangThai === "overdue"
                  ? "Quá hạn"
                  : r.trangThai === "returned"
                    ? "Đã trả"
                    : "Đang mượn"}
              </Badge>
            ),
            className: "w-32",
          },
        ]}
        searchFilter={(r, q) => {
          const dn = docGia.find((d) => d.MaDocGia === r.MaDocGia)?.HoTen.toLowerCase() ?? "";
          return dn.includes(q) || String(r.MaPhieuMuon).includes(q);
        }}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deletePhieuMuon(r.MaPhieuMuon);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV(
            "phieu-muon",
            rows.map((r) => ({
              MaPhieuMuon: r.MaPhieuMuon,
              DocGia: docGia.find((d) => d.MaDocGia === r.MaDocGia)?.HoTen ?? "",
              NgayMuon: r.NgayMuon,
              HanTra: r.HanTra,
              SoSach: r.soSach,
              TrangThai:
                r.trangThai === "overdue"
                  ? "Quá hạn"
                  : r.trangThai === "returned"
                    ? "Đã trả"
                    : "Đang mượn",
            })),
          )
        }
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa phiếu mượn" : "Tạo phiếu mượn"}
        onSubmit={submit}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 space-y-2">
            <Label>Độc giả</Label>
            <Select
              value={String(form.MaDocGia)}
              onValueChange={(v) => setForm({ ...form, MaDocGia: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn độc giả" />
              </SelectTrigger>
              <SelectContent>
                {docGia.map((d) => (
                  <SelectItem key={d.MaDocGia} value={String(d.MaDocGia)}>
                    {d.HoTen}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ngày mượn</Label>
            <Input
              type="date"
              value={form.NgayMuon}
              onChange={(e) => setForm({ ...form, NgayMuon: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Hạn trả</Label>
            <Input
              type="date"
              value={form.HanTra}
              onChange={(e) => setForm({ ...form, HanTra: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Chi tiết sách mượn</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setItems([...items, { MaSach: sach[0]?.MaSach ?? 0, SoLuong: 1 }])}
            >
              <Plus className="mr-1 h-4 w-4" /> Thêm sách
            </Button>
          </div>
          <div className="space-y-2">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Chưa có sách nào.</p>
            )}
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <div className="col-span-8">
                  <Select
                    value={String(it.MaSach)}
                    onValueChange={(v) => {
                      const cp = [...items];
                      cp[idx] = { ...cp[idx], MaSach: Number(v) };
                      setItems(cp);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sach.map((s) => (
                        <SelectItem key={s.MaSach} value={String(s.MaSach)}>
                          {s.TenSach} (còn {s.SoLuongCon})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  className="col-span-3"
                  type="number"
                  min={1}
                  value={it.SoLuong}
                  onChange={(e) => {
                    const cp = [...items];
                    cp[idx] = { ...cp[idx], SoLuong: Number(e.target.value) };
                    setItems(cp);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </FormDialog>
    </>
  );
}
