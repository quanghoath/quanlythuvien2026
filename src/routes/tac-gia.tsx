import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { TacGia } from "@/types/library";

export const Route = createFileRoute("/tac-gia")({ component: Page });

function Page() {
  const { tacGia, addTacGia, updateTacGia, deleteTacGia } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TacGia | null>(null);
  const [ten, setTen] = useState("");

  const openAdd = () => {
    setEditing(null);
    setTen("");
    setOpen(true);
  };
  const openEdit = (r: TacGia) => {
    setEditing(r);
    setTen(r.TenTacGia);
    setOpen(true);
  };

  const submit = () => {
    if (!ten.trim()) return toast.error("Vui lòng nhập tên tác giả");
    if (editing) {
      updateTacGia(editing.MaTacGia, { TenTacGia: ten.trim() });
      toast.success("Đã cập nhật");
    } else {
      addTacGia({ TenTacGia: ten.trim() });
      toast.success("Đã thêm");
    }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Tác giả"
        description="Quản lý danh sách tác giả."
        summary={[
          { label: "Tác giả", value: tacGia.length, hint: "Số tác giả đang được lưu trữ." },
        ]}
        searchPlaceholder="Tìm theo tên tác giả..."
        emptyTitle="Chưa có tác giả"
        emptyDescription="Tạo danh sách tác giả để liên kết chính xác với các đầu sách."
        data={tacGia}
        getId={(r) => r.MaTacGia}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaTacGia, className: "w-20" },
          { key: "ten", header: "Tên tác giả", render: (r) => r.TenTacGia },
        ]}
        searchFilter={(r, q) => r.TenTacGia.toLowerCase().includes(q)}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deleteTacGia(r.MaTacGia);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV("tac-gia", tacGia, [
            { key: "MaTacGia", label: "Mã" },
            { key: "TenTacGia", label: "Tên tác giả" },
          ])
        }
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa tác giả" : "Thêm tác giả"}
        onSubmit={submit}
      >
        <div className="space-y-2">
          <Label>Tên tác giả</Label>
          <Input value={ten} onChange={(e) => setTen(e.target.value)} autoFocus />
        </div>
      </FormDialog>
    </>
  );
}
