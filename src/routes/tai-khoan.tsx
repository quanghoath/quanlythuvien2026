import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { TaiKhoan } from "@/types/library";

export const Route = createFileRoute("/tai-khoan")({ component: Page });

function Page() {
  const { taiKhoan, vaiTro, addTaiKhoan, updateTaiKhoan, deleteTaiKhoan } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaiKhoan | null>(null);
  const [form, setForm] = useState({ TenDangNhap: "", MatKhau: "", HoTen: "", MaVaiTro: 0 });

  const openAdd = () => {
    setEditing(null);
    setForm({ TenDangNhap: "", MatKhau: "", HoTen: "", MaVaiTro: vaiTro[0]?.MaVaiTro ?? 0 });
    setOpen(true);
  };
  const openEdit = (r: TaiKhoan) => {
    setEditing(r);
    setForm({
      TenDangNhap: r.TenDangNhap,
      MatKhau: r.MatKhau,
      HoTen: r.HoTen,
      MaVaiTro: r.MaVaiTro,
    });
    setOpen(true);
  };

  const submit = () => {
    if (!form.TenDangNhap.trim() || !form.HoTen.trim() || !form.MaVaiTro) {
      return toast.error("Vui lòng điền đủ thông tin");
    }
    if (editing) {
      updateTaiKhoan(editing.MaTaiKhoan, form);
      toast.success("Đã cập nhật");
    } else {
      if (!form.MatKhau) return toast.error("Vui lòng nhập mật khẩu");
      addTaiKhoan(form);
      toast.success("Đã thêm");
    }
    setOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Tài khoản"
        description="Quản lý tài khoản đăng nhập."
        summary={[
          {
            label: "Tài khoản",
            value: taiKhoan.length,
            hint: "Số tài khoản đang hoạt động trong hệ thống.",
          },
          { label: "Vai trò", value: vaiTro.length, hint: "Số nhóm quyền đang được sử dụng." },
        ]}
        searchPlaceholder="Tìm theo tên đăng nhập hoặc họ tên..."
        emptyTitle="Chưa có tài khoản"
        emptyDescription="Tạo tài khoản để cấp quyền truy cập cho nhân sự vận hành."
        data={taiKhoan}
        getId={(r) => r.MaTaiKhoan}
        columns={[
          { key: "id", header: "Mã", render: (r) => r.MaTaiKhoan, className: "w-16" },
          { key: "u", header: "Tên đăng nhập", render: (r) => r.TenDangNhap },
          { key: "h", header: "Họ tên", render: (r) => r.HoTen },
          {
            key: "v",
            header: "Vai trò",
            render: (r) => vaiTro.find((x) => x.MaVaiTro === r.MaVaiTro)?.TenVaiTro ?? "—",
          },
        ]}
        searchFilter={(r, q) =>
          r.TenDangNhap.toLowerCase().includes(q) || r.HoTen.toLowerCase().includes(q)
        }
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(r) => {
          deleteTaiKhoan(r.MaTaiKhoan);
          toast.success("Đã xoá");
        }}
        onExport={() =>
          exportToCSV(
            "tai-khoan",
            taiKhoan.map((t) => ({
              MaTaiKhoan: t.MaTaiKhoan,
              TenDangNhap: t.TenDangNhap,
              HoTen: t.HoTen,
              VaiTro: vaiTro.find((v) => v.MaVaiTro === t.MaVaiTro)?.TenVaiTro ?? "",
            })),
          )
        }
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Sửa tài khoản" : "Thêm tài khoản"}
        onSubmit={submit}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tên đăng nhập</Label>
            <Input
              value={form.TenDangNhap}
              onChange={(e) => setForm({ ...form, TenDangNhap: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Mật khẩu{" "}
              {editing && (
                <span className="text-xs text-muted-foreground">(để trống = giữ nguyên)</span>
              )}
            </Label>
            <Input
              type="password"
              value={form.MatKhau}
              onChange={(e) => setForm({ ...form, MatKhau: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Họ tên</Label>
            <Input
              value={form.HoTen}
              onChange={(e) => setForm({ ...form, HoTen: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Vai trò</Label>
            <Select
              value={String(form.MaVaiTro)}
              onValueChange={(v) => setForm({ ...form, MaVaiTro: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {vaiTro.map((v) => (
                  <SelectItem key={v.MaVaiTro} value={String(v.MaVaiTro)}>
                    {v.TenVaiTro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>
    </>
  );
}
