import { createFileRoute } from "@tanstack/react-router";
import { useLibrary } from "@/store/libraryStore";
import { CrudPage } from "@/components/shared/CrudPage";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/nhat-ky-sach")({ component: Page });

function Page() {
  const { nhatKySach, sach, deleteNhatKy } = useLibrary();
  const homNay = new Date().toDateString();
  const capNhatHomNay = nhatKySach.filter(
    (item) => new Date(item.NgayCapNhat).toDateString() === homNay,
  ).length;

  return (
    <CrudPage
      title="Nhật ký sách"
      description="Lịch sử thay đổi thông tin sách."
      summary={[
        { label: "Bản ghi", value: nhatKySach.length, hint: "Tổng số thay đổi đã được lưu." },
        {
          label: "Cập nhật hôm nay",
          value: capNhatHomNay,
          hint: "Những thay đổi phát sinh trong ngày.",
        },
      ]}
      searchPlaceholder="Tìm theo tên sách cũ hoặc mới..."
      emptyTitle="Chưa có nhật ký thay đổi"
      emptyDescription="Lịch sử chỉnh sửa sách sẽ xuất hiện tại đây khi dữ liệu được cập nhật."
      data={nhatKySach}
      getId={(r) => r.MaNhatKy}
      columns={[
        { key: "id", header: "Mã", render: (r) => r.MaNhatKy, className: "w-16" },
        {
          key: "s",
          header: "Sách",
          render: (r) => sach.find((x) => x.MaSach === r.MaSach)?.TenSach ?? "—",
        },
        { key: "c", header: "Tên cũ", render: (r) => r.TenSachCu ?? "—" },
        { key: "m", header: "Tên mới", render: (r) => r.TenSachMoi ?? "—" },
        {
          key: "n",
          header: "Ngày cập nhật",
          render: (r) => new Date(r.NgayCapNhat).toLocaleString("vi-VN"),
          className: "w-44",
        },
      ]}
      searchFilter={(r, q) =>
        (r.TenSachCu ?? "").toLowerCase().includes(q) ||
        (r.TenSachMoi ?? "").toLowerCase().includes(q)
      }
      onDelete={(r) => {
        deleteNhatKy(r.MaNhatKy);
        toast.success("Đã xoá");
      }}
      onExport={() => exportToCSV("nhat-ky-sach", nhatKySach)}
    />
  );
}
