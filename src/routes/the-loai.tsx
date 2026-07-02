import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { TheLoai } from "@/types/library";

export const Route = createFileRoute("/the-loai")({ component: Page });

function Page() {
  const { theLoai, sach, addTheLoai, updateTheLoai, deleteTheLoai } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TheLoai | null>(null);
  const [ten, setTen] = useState("");

  const openAdd = () => {
    setEditing(null);
    setTen("");
    setOpen(true);
  };
  const openEdit = (r: TheLoai) => {
    setEditing(r);
    setTen(r.TenTheLoai);
    setOpen(true);
  };

  const submit = () => {
    if (!ten.trim()) return toast.error("Vui lòng nhập tên thể loại");
    if (editing) {
      updateTheLoai(editing.MaTheLoai, { TenTheLoai: ten.trim() });
      toast.success("Đã cập nhật");
    } else {
      addTheLoai({ TenTheLoai: ten.trim() });
      toast.success("Đã thêm");
    }
    setOpen(false);
  };

  const tongSachGanTheLoai = sach.length;

  return (
    <>
      <CrudPage
        title="Thể loại"
        description="Phân loại sách trong thư viện."
        summary={[
          { label: "Thể loại", value: theLoai.length, hint: "Số nhóm phân loại hiện có." },
          {
            label: "Sách đã phân loại",
            value: tongSachGanTheLoai,
            hint: "Tổng số đầu sách đang gắn thể loại.",
          },
        ]}
        searchPlaceholder="Tìm theo tên thể loại..."
        emptyTitle="Chưa có thể loại"
        emptyDescription="Tạo thể loại để cấu trúc kho sách và tăng tốc độ tra cứu."
        data={theLoai}
        getId={(r) => r.MaTheLoai}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaTheLoai, className: "w-20" },
          { key: "ten", header: "Tên thể loại", render: (r) => r.TenTheLoai },
          {
            key: "count",
            header: "Số đầu sách",
            render: (r) => sach.filter((s) => s.MaTheLoai === r.MaTheLoai).length,
            className: "w-32",
          },
        ]}
        searchFilter={(r, q) => r.TenTheLoai.toLowerCase().includes(q)}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deleteTheLoai(r.MaTheLoai);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV("the-loai", theLoai, [
            { key: "MaTheLoai", label: "Mã" },
            { key: "TenTheLoai", label: "Tên thể loại" },
          ])
        }
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa thể loại" : "Thêm thể loại"}
        onSubmit={submit}
      >
        <div className="space-y-2">
          <Label>Tên thể loại</Label>
          <Input value={ten} onChange={(e) => setTen(e.target.value)} autoFocus />
        </div>
      </FormDialog>
    </>
  );
}
