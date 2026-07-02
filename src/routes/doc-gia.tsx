import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { DocGia } from "@/types/library";

export const Route = createFileRoute("/doc-gia")({ component: Page });

function Page() {
  const { docGia, addDocGia, updateDocGia, deleteDocGia } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocGia | null>(null);
  const [form, setForm] = useState({ HoTen: "", SoDienThoai: "", DiaChi: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ HoTen: "", SoDienThoai: "", DiaChi: "" });
    setOpen(true);
  };
  const openEdit = (r: DocGia) => {
    setEditing(r);
    setForm({ HoTen: r.HoTen, SoDienThoai: r.SoDienThoai ?? "", DiaChi: r.DiaChi ?? "" });
    setOpen(true);
  };

  const submit = () => {
    if (!form.HoTen.trim()) return toast.error("Vui lòng nhập họ tên");
    if (editing) {
      updateDocGia(editing.MaDocGia, form);
      toast.success("Đã cập nhật");
    } else {
      addDocGia(form);
      toast.success("Đã thêm");
    }
    setOpen(false);
  };

  const coSoDienThoai = docGia.filter((item) => !!item.SoDienThoai).length;
  const coDiaChi = docGia.filter((item) => !!item.DiaChi).length;

  return (
    <>
      <CrudPage
        title="Độc giả"
        description="Danh sách độc giả của thư viện."
        summary={[
          { label: "Độc giả", value: docGia.length, hint: "Tổng số hồ sơ bạn đọc." },
          { label: "Có số điện thoại", value: coSoDienThoai, hint: "Hồ sơ đủ thông tin liên hệ." },
          { label: "Có địa chỉ", value: coDiaChi, hint: "Hồ sơ có địa chỉ lưu trú." },
        ]}
        searchPlaceholder="Tìm theo họ tên, số điện thoại hoặc địa chỉ..."
        emptyTitle="Chưa có độc giả"
        emptyDescription="Thêm hồ sơ bạn đọc để bắt đầu tạo phiếu mượn và theo dõi lịch sử giao dịch."
        data={docGia}
        getId={(r) => r.MaDocGia}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaDocGia, className: "w-16" },
          { key: "h", header: "Họ tên", render: (r) => r.HoTen },
          { key: "p", header: "Số điện thoại", render: (r) => r.SoDienThoai ?? "—" },
          { key: "a", header: "Địa chỉ", render: (r) => r.DiaChi ?? "—" },
        ]}
        searchFilter={(r, q) =>
          r.HoTen.toLowerCase().includes(q) ||
          (r.SoDienThoai ?? "").toLowerCase().includes(q) ||
          (r.DiaChi ?? "").toLowerCase().includes(q)
        }
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deleteDocGia(r.MaDocGia);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV("doc-gia", docGia, [
            { key: "MaDocGia", label: "Mã" },
            { key: "HoTen", label: "Họ tên" },
            { key: "SoDienThoai", label: "SĐT" },
            { key: "DiaChi", label: "Địa chỉ" },
          ])
        }
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa độc giả" : "Thêm độc giả"}
        onSubmit={submit}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Họ tên</Label>
            <Input
              value={form.HoTen}
              onChange={(e) => setForm({ ...form, HoTen: e.target.value })}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input
              value={form.SoDienThoai}
              onChange={(e) => setForm({ ...form, SoDienThoai: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Địa chỉ</Label>
            <Input
              value={form.DiaChi}
              onChange={(e) => setForm({ ...form, DiaChi: e.target.value })}
            />
          </div>
        </div>
      </FormDialog>
    </>
  );
}
