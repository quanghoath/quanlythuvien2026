import { Link, useRouterState } from "@tanstack/react-router";
import { Library, LogOut, Shield } from "lucide-react";

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
import { navigationSections } from "@/components/layout/navigation";

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  const { currentUser, logout } = useAuth();
  const { vaiTro } = useLibrary();
  const role = vaiTro.find((v) => v.MaVaiTro === currentUser?.MaVaiTro)?.TenVaiTro ?? "";

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r-0">
      <SidebarHeader className="rounded-t-2xl border-b border-sidebar-border/70 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/20">
            <Library className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold leading-none text-sidebar-foreground">
              Quản lý thư viện
            </span>
            <span className="mt-1 text-xs text-sidebar-foreground/65">Enterprise workspace</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigationSections.map((section) => (
          <SidebarGroup key={section.label} className="px-3 py-2">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className="h-10 rounded-xl px-3 text-sm"
                    >
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
        ))}
      </SidebarContent>
      <SidebarFooter className="rounded-b-2xl border-t border-sidebar-border/70 p-3">
        <div className="group-data-[collapsible=icon]:hidden">
          {currentUser && (
            <div className="mb-3 rounded-xl border border-white/8 bg-white/5 p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-foreground">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-none text-sidebar-foreground">
                    {currentUser.HoTen}
                  </p>
                  <p className="mt-1 truncate text-xs text-sidebar-foreground/65">{role}</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/10 bg-white/5 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
