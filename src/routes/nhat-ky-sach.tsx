import { createFileRoute } from "@tanstack/react-router";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/nhat-ky-sach")({ component: Page });

function Page() {
  const { nhatKySach, sach, deleteNhatKy } = useLibrary();

  return (
    <CrudPage
      title="Nhật ký sách"
      description="Lịch sử thay đổi thông tin sách."
      data={nhatKySach}
      getId={(r) => r.MaNhatKy}
      columns={[
        { key: "id", header: "Mã", render: (r) => r.MaNhatKy, className: "w-16" },
        { key: "s", header: "Sách", render: (r) => sach.find((x) => x.MaSach === r.MaSach)?.TenSach ?? "—" },
        { key: "c", header: "Tên cũ", render: (r) => r.TenSachCu ?? "—" },
        { key: "m", header: "Tên mới", render: (r) => r.TenSachMoi ?? "—" },
        { key: "n", header: "Ngày cập nhật", render: (r) => new Date(r.NgayCapNhat).toLocaleString("vi-VN"), className: "w-44" },
      ]}
      searchFilter={(r, q) =>
        (r.TenSachCu ?? "").toLowerCase().includes(q) || (r.TenSachMoi ?? "").toLowerCase().includes(q)
      }
      onDelete={(r) => { deleteNhatKy(r.MaNhatKy); toast.success("Đã xoá"); }}
      onExport={() => exportToCSV("nhat-ky-sach", nhatKySach)}
    />
  );
}
