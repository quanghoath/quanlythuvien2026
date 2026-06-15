import { useState } from "react";
import { Library, Loader2 } from "lucide-react";
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(u, p);
      setLoading(false);
      if (!res.ok) toast.error(res.message ?? "Đăng nhập thất bại");
      else toast.success("Đăng nhập thành công");
    }, 250);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Library className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Quản lý thư viện</h1>
          <p className="mt-1 text-sm text-muted-foreground">Đăng nhập để tiếp tục</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>Nhập tên đăng nhập và mật khẩu</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="u">Tên đăng nhập</Label>
                <Input id="u" value={u} onChange={(e) => setU(e.target.value)} autoFocus required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p">Mật khẩu</Label>
                <Input id="p" type="password" value={p} onChange={(e) => setP(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Tài khoản demo:</p>
                <p>• admin / admin123</p>
                <p>• thuthu / 123456</p>
                <p>• nhanvien / 123456</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
