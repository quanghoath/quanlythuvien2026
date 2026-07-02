import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LibraryProvider } from "@/store/libraryStore";
import { AuthProvider, useAuth } from "@/store/authStore";
import { Toaster } from "@/components/ui/sonner";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { Badge } from "@/components/ui/badge";
import { getRouteMeta } from "@/components/layout/navigation";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Điều hướng không hợp lệ
        </div>
        <h1 className="text-7xl font-semibold tracking-tight text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Không tìm thấy trang</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Trang bạn truy cập không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 inline-flex rounded-full border border-destructive/20 bg-destructive/8 px-3 py-1 text-xs font-medium text-destructive">
          Application error
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Có lỗi xảy ra</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Quản lý thư viện sách" },
      {
        name: "description",
        content: "Hệ thống quản lý thư viện: sách, độc giả, mượn trả và báo cáo.",
      },
      { property: "og:title", content: "Quản lý thư viện sách" },
      { name: "twitter:title", content: "Quản lý thư viện sách" },
      {
        property: "og:description",
        content: "Hệ thống quản lý thư viện: sách, độc giả, mượn trả và báo cáo.",
      },
      {
        name: "twitter:description",
        content: "Hệ thống quản lý thư viện: sách, độc giả, mượn trả và báo cáo.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthedShell() {
  const { currentUser } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeMeta = getRouteMeta(pathname);
  if (!currentUser) return <LoginScreen />;

  const today = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-h-screen bg-transparent">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <SidebarTrigger className="h-9 w-9 rounded-xl border border-border bg-card shadow-sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {routeMeta.title}
                  </p>
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {routeMeta.sectionLabel}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  Workspace vận hành thư viện với dữ liệu thời gian thực.
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Hôm nay
                </p>
                <p className="text-sm font-medium text-foreground">{today}</p>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LibraryProvider>
          <AuthedShell />
          <Toaster richColors position="top-right" />
        </LibraryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
