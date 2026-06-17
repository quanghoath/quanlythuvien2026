import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Users,
  BookMarked,
  Tag,
  BarChart3,
  LayoutDashboard,
  Library,
  UserSquare2,
  ShieldCheck,
  UserCog,
  RotateCcw,
  History,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/authStore";
import { useLibrary } from "@/store/libraryStore";
import { Button } from "@/components/ui/button";

const nghiepVu = [
  { title: "Tổng quan", url: "/", icon: LayoutDashboard },
  { title: "Sách", url: "/sach", icon: BookOpen },
  { title: "Tác giả", url: "/tac-gia", icon: UserSquare2 },
  { title: "Thể loại", url: "/the-loai", icon: Tag },
  { title: "Độc giả", url: "/doc-gia", icon: Users },
  { title: "Phiếu mượn", url: "/phieu-muon", icon: BookMarked },
  { title: "Phiếu trả", url: "/phieu-tra", icon: RotateCcw },
  { title: "Nhật ký sách", url: "/nhat-ky-sach", icon: History },
  { title: "Báo cáo", url: "/bao-cao", icon: BarChart3 },
];

const heThong = [
  { title: "Tài khoản", url: "/tai-khoan", icon: UserCog },
  { title: "Vai trò", url: "/vai-tro", icon: ShieldCheck },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  const { currentUser, logout } = useAuth();
  const { vaiTro } = useLibrary();
  const role = vaiTro.find((v) => v.MaVaiTro === currentUser?.MaVaiTro)?.TenVaiTro ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-semibold leading-none">Thư viện</span>
            <span className="text-xs text-muted-foreground">Hệ thống quản lý</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nghiệp vụ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nghiepVu.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {heThong.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="group-data-[collapsible=icon]:hidden">
          {currentUser && (
            <div className="mb-2 px-1">
              <p className="text-sm font-medium leading-none">{currentUser.HoTen}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{role}</p>
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
