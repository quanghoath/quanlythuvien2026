import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookOpen, Users, BookMarked, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/store/libraryStore";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)"];

const today = () => new Date().toISOString().slice(0, 10);

function DashboardPage() {
  const { sach, docGia, phieuMuon, phieuTra, theLoai } = useLibrary();

  const stats = useMemo(() => {
    const tongSach = sach.reduce((s, b) => s + b.SoLuong, 0);
    const conLai = sach.reduce((s, b) => s + b.SoLuongCon, 0);
    const dangMuon = phieuMuon.filter(
      (pm) => !phieuTra.some((pt) => pt.MaPhieuMuon === pm.MaPhieuMuon)
    );
    const quaHan = dangMuon.filter((pm) => pm.HanTra < today()).length;
    return { tongSach, conLai, dangMuon: dangMuon.length, quaHan };
  }, [sach, phieuMuon, phieuTra]);

  const sachTheoTheLoai = useMemo(
    () =>
      theLoai.map((c) => ({
        name: c.TenTheLoai,
        value: sach.filter((b) => b.MaTheLoai === c.MaTheLoai).reduce((s, b) => s + b.SoLuong, 0),
      })),
    [theLoai, sach]
  );

  const muonTheoThang = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      map.set(key, 0);
    }
    phieuMuon.forEach((pm) => {
      const d = new Date(pm.NgayMuon);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
  }, [phieuMuon]);

  const phieuGanDay = useMemo(
    () =>
      [...phieuMuon]
        .sort((a, b) => b.NgayMuon.localeCompare(a.NgayMuon))
        .slice(0, 5)
        .map((pm) => {
          const dg = docGia.find((d) => d.MaDocGia === pm.MaDocGia);
          const daTra = phieuTra.some((pt) => pt.MaPhieuMuon === pm.MaPhieuMuon);
          const quaHan = !daTra && pm.HanTra < today();
          return {
            ...pm,
            tenDocGia: dg?.HoTen ?? "—",
            trangThai: daTra ? "returned" : quaHan ? "overdue" : "borrowing",
          };
        }),
    [phieuMuon, docGia, phieuTra]
  );

  return (
    <div className="space-y-8">
      <PageHeader title="Tổng quan" description="Cái nhìn nhanh về tình trạng thư viện hôm nay." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng số sách" value={stats.tongSach} icon={BookOpen} hint={`${sach.length} đầu sách`} />
        <StatCard label="Đang có sẵn" value={stats.conLai} icon={BookMarked} tone="success" />
        <StatCard label="Độc giả" value={docGia.length} icon={Users} />
        <StatCard label="Quá hạn" value={stats.quaHan} icon={AlertTriangle} tone="destructive" hint={`${stats.dangMuon} đang mượn`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lượt mượn 6 tháng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muonTheoThang}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sách theo thể loại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sachTheoTheLoai} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {sachTheoTheLoai.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phiếu mượn gần đây</CardTitle>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/phieu-tra"><RotateCcw className="mr-1 h-4 w-4" /> Phiếu trả</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/phieu-muon">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {phieuGanDay.map((pm) => (
              <div key={pm.MaPhieuMuon} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Phiếu #{pm.MaPhieuMuon} · {pm.tenDocGia}</p>
                  <p className="text-sm text-muted-foreground">Mượn {pm.NgayMuon} · hạn {pm.HanTra}</p>
                </div>
                <Badge variant={pm.trangThai === "overdue" ? "destructive" : pm.trangThai === "returned" ? "secondary" : "default"}>
                  {pm.trangThai === "overdue" ? "Quá hạn" : pm.trangThai === "returned" ? "Đã trả" : "Đang mượn"}
                </Badge>
              </div>
            ))}
            {phieuGanDay.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Chưa có phiếu mượn nào.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
