import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { FormDialog } from "@/components/shared/FormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { VaiTro } from "@/types/library";

export const Route = createFileRoute("/vai-tro")({ component: Page });

function Page() {
  const { vaiTro, addVaiTro, updateVaiTro, deleteVaiTro } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VaiTro | null>(null);
  const [ten, setTen] = useState("");

  const openAdd = () => {
    setEditing(null);
    setTen("");
    setOpen(true);
  };
  const openEdit = (r: VaiTro) => {
    setEditing(r);
    setTen(r.TenVaiTro);
    setOpen(true);
  };

  const submit = () => {
    if (!ten.trim()) return toast.error("Vui lòng nhập tên vai trò");
    if (editing) {
      updateVaiTro(editing.MaVaiTro, { TenVaiTro: ten.trim() });
      toast.success("Đã cập nhật");
    } else {
      addVaiTro({ TenVaiTro: ten.trim() });
      toast.success("Đã thêm");
    }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Vai trò"
        description="Quản lý vai trò người dùng hệ thống."
        data={vaiTro}
        getId={(r) => r.MaVaiTro}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaVaiTro, className: "w-20" },
          { key: "ten", header: "Tên vai trò", render: (r) => r.TenVaiTro },
        ]}
        searchFilter={(r, q) => r.TenVaiTro.toLowerCase().includes(q)}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deleteVaiTro(r.MaVaiTro);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV("vai-tro", vaiTro, [
            { key: "MaVaiTro", label: "Mã" },
            { key: "TenVaiTro", label: "Tên vai trò" },
          ])
        }
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa vai trò" : "Thêm vai trò"}
        onSubmit={submit}
      >
        <div className="space-y-2">
          <Label>Tên vai trò</Label>
          <Input value={ten} onChange={(e) => setTen(e.target.value)} autoFocus />
        </div>
      </FormDialog>
    </>
  );
}
