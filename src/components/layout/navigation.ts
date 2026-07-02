import {
  BookMarked,
  BookOpen,
  History,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
  Tag,
  UserCog,
  Users,
  UserSquare2,
} from "lucide-react";

export const navigationSections = [
  {
    label: "Nghiệp vụ",
    items: [
      { title: "Tổng quan", url: "/", icon: LayoutDashboard, shortTitle: "Dashboard" },
      { title: "Sách", url: "/sach", icon: BookOpen, shortTitle: "Sách" },
      { title: "Tác giả", url: "/tac-gia", icon: UserSquare2, shortTitle: "Tác giả" },
      { title: "Thể loại", url: "/the-loai", icon: Tag, shortTitle: "Thể loại" },
      { title: "Độc giả", url: "/doc-gia", icon: Users, shortTitle: "Độc giả" },
      { title: "Phiếu mượn", url: "/phieu-muon", icon: BookMarked, shortTitle: "Phiếu mượn" },
      { title: "Phiếu trả", url: "/phieu-tra", icon: RotateCcw, shortTitle: "Phiếu trả" },
      { title: "Nhật ký sách", url: "/nhat-ky-sach", icon: History, shortTitle: "Nhật ký" },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { title: "Tài khoản", url: "/tai-khoan", icon: UserCog, shortTitle: "Tài khoản" },
      { title: "Vai trò", url: "/vai-tro", icon: ShieldCheck, shortTitle: "Vai trò" },
    ],
  },
];

export function getRouteMeta(pathname: string) {
  for (const section of navigationSections) {
    const match = section.items.find((item) =>
      item.url === "/" ? pathname === "/" : pathname.startsWith(item.url),
    );
    if (match) {
      return { ...match, sectionLabel: section.label };
    }
  }

  return {
    title: "Hệ thống quản lý thư viện",
    shortTitle: "Thư viện",
    url: pathname,
    sectionLabel: "Điều hướng",
  };
}
