import { useState } from "react";
import { Library, Loader2, ShieldCheck, BookCopy, Users } from "lucide-react";
import { useAuth } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginScreen() {
  const { login } = useAuth();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!u.trim() || !p) {
      toast.error("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      const res = await login(u.trim(), p);
      if (!res.ok) toast.error(res.message ?? "Đăng nhập thất bại");
      else toast.success(res.message ?? "Đăng nhập thành công");
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="relative grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-slate-950/8 ">
          <div className="w-full max-w-md">
            <div className="mb-6 flex flex-col items-center text-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Library className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Quản lý thư viện</h1>
              <p className="mt-2 text-sm text-muted-foreground">Đăng nhập để tiếp tục</p>
            </div>

            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>
                  Sử dụng tài khoản được cấp để truy cập workspace vận hành.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="u">Tên đăng nhập</Label>
                    <Input
                      id="u"
                      value={u}
                      onChange={(e) => setU(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p">Mật khẩu</Label>
                    <Input
                      id="p"
                      type="password"
                      value={p}
                      onChange={(e) => setP(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng nhập
                  </Button>
                  <div className="rounded-2xl border border-dashed border-border bg-muted/35 p-4 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Tài khoản demo</p>
                    <p className="mt-2">admin / admin</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
