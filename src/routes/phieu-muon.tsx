import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { phieumuonApi } from "@/api/phieumuon";
import type { PhieuMuon, PhieuMuonChiTietItem } from "@/types/library";

export const Route = createFileRoute("/phieu-muon")({ component: Page });

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmtDate = (s?: string) => (s ? s.slice(0, 10) : "—");

type LineItem = { MaSach: number; SoLuong: number };

const stateLabel = (s?: string) => {
  switch (s) {
    case "NEW":
      return { text: "Đang mượn", variant: "default" as const };
    case "RETURNED":
      return { text: "Đã trả", variant: "secondary" as const };
    case "OVERDUE":
      return { text: "Quá hạn", variant: "destructive" as const };
    default:
      return { text: s ?? "—", variant: "outline" as const };
  }
};

function Page() {
  const { phieuMuon, docGia, sach, addPhieuMuon, deletePhieuMuon } = useLibrary();

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ MaDocGia: 0, NgayMuon: today(), HanTra: addDays(14) });
  const [items, setItems] = useState<LineItem[]>([]);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewData, setViewData] = useState<{
    pm: PhieuMuon | null;
    details: PhieuMuonChiTietItem[];
  }>({ pm: null, details: [] });

  const rows = useMemo(() => phieuMuon, [phieuMuon]);

  const handleAdd = () => {
    setForm({ MaDocGia: docGia[0]?.MaDocGia ?? 0, NgayMuon: today(), HanTra: addDays(14) });
    setItems([]);
    setOpenAdd(true);
  };

  const handleView = async (r: PhieuMuon) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewData({ pm: r, details: [] });
    try {
      const { data } = await phieumuonApi.getById(r.MaPhieuMuon);
      const payload = data.data;
      setViewData({
        pm: payload?.data ?? r,
        details: payload?.details ?? [],
      });
    } catch {
      toast.error("Không tải được chi tiết phiếu mượn");
    } finally {
      setViewLoading(false);
    }
  };

  const submit = async () => {
    if (!form.MaDocGia) return toast.error("Chọn độc giả");
    if (form.HanTra < form.NgayMuon) return toast.error("Hạn trả phải >= ngày mượn");
    if (items.length === 0) return toast.error("Thêm ít nhất 1 sách");
    if (items.some((i) => !i.MaSach || i.SoLuong < 1)) return toast.error("Chi tiết không hợp lệ");
    try {
      await addPhieuMuon(
        { MaDocGia: form.MaDocGia, NgayMuon: form.NgayMuon, HanTra: form.HanTra },
        items,
      );
      toast.success("Đã tạo phiếu mượn");
      setOpenAdd(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi tạo phiếu");
    }
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
          { key: "dg", header: "Độc giả", render: (r) => r.TenDocGia ?? r.MaDocGia ?? "—" },
          { key: "nm", header: "Ngày mượn", render: (r) => fmtDate(r.NgayMuon), className: "w-32" },
          { key: "ht", header: "Hạn trả", render: (r) => fmtDate(r.HanTra), className: "w-32" },
          { key: "sl", header: "Số sách", render: (r) => r.SoLuongSach ?? 0, className: "w-24" },
          {
            key: "tt",
            header: "Trạng thái",
            render: (r) => {
              const { text, variant } = stateLabel(r.State);
              return <Badge variant={variant}>{text}</Badge>;
            },
            className: "w-32",
          },
        ]}
        searchFilter={(r, q) =>
          String(r.TenDocGia ?? "")
            .toLowerCase()
            .includes(q) || String(r.MaPhieuMuon).includes(q)
        }
        onAdd={handleAdd}
        onEdit={handleView}
        onDelete={(r) => {
          deletePhieuMuon(r.MaPhieuMuon)
            .then(() => toast.success("Đã xoá"))
            .catch((e) => toast.error(e instanceof Error ? e.message : "Lỗi xoá"));
        }}
        editIcon={<Eye className="h-4 w-4" />}
        onExport={() =>
          exportToCSV(
            "phieu-muon",
            rows.map((r) => ({
              MaPhieuMuon: r.MaPhieuMuon,
              DocGia: r.TenDocGia ?? r.MaDocGia ?? "",
              NgayMuon: fmtDate(r.NgayMuon),
              HanTra: fmtDate(r.HanTra),
              SoLuongSach: r.SoLuongSach ?? 0,
              State: r.State ?? "",
            })),
          )
        }
      />

      <FormDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        title="Tạo phiếu mượn"
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết phiếu mượn #{viewData.pm?.MaPhieuMuon ?? ""}
            </DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải...</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Độc giả:</span>{" "}
                  <span className="font-medium">
                    {viewData.pm?.TenDocGia ?? viewData.pm?.MaDocGia ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trạng thái:</span>{" "}
                  <Badge variant={stateLabel(viewData.pm?.State).variant}>
                    {stateLabel(viewData.pm?.State).text}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày mượn:</span>{" "}
                  {fmtDate(viewData.pm?.NgayMuon)}
                </div>
                <div>
                  <span className="text-muted-foreground">Hạn trả:</span>{" "}
                  {fmtDate(viewData.pm?.HanTra)}
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sách</TableHead>
                      <TableHead className="w-24 text-right">Số lượng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewData.details.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                          Không có chi tiết
                        </TableCell>
                      </TableRow>
                    ) : (
                      viewData.details.map((d, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            {d.TenSach ??
                              sach.find((s) => s.MaSach === d.MaSach)?.TenSach ??
                              `#${d.MaSach}`}
                          </TableCell>
                          <TableCell className="text-right">{d.SoLuong}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
