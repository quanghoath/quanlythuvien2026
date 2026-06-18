import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Users, BookMarked, AlertTriangle, ArrowRight, Library } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baocaoApi } from "@/api/baocao";
import type { BaoCaoRp1, BaoCaoRp2, BaoCaoRp3, BaoCaoRp4, BaoCaoRp5 } from "@/types/library";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString("vi-VN") : "—");

function DashboardPage() {
  const [rp1, setRp1] = useState<BaoCaoRp1 | null>(null);
  const [rp2, setRp2] = useState<BaoCaoRp2[]>([]);
  const [rp3, setRp3] = useState<BaoCaoRp3[]>([]);
  const [rp4, setRp4] = useState<BaoCaoRp4[]>([]);
  const [rp5, setRp5] = useState<BaoCaoRp5[]>([]);

  useEffect(() => {
    baocaoApi.getRp1().then((r) => setRp1(r.data.data)).catch(() => {});
    baocaoApi.getRp2().then((r) => setRp2(r.data.data ?? [])).catch(() => {});
    baocaoApi.getRp3().then((r) => setRp3(r.data.data ?? [])).catch(() => {});
    baocaoApi.getRp4().then((r) => setRp4(r.data.data ?? [])).catch(() => {});
    baocaoApi.getRp5().then((r) => setRp5(r.data.data ?? [])).catch(() => {});
  }, []);

  const muonTheoThang = rp2.map((x) => ({
    month: `${x.Thang}/${x.Nam}`,
    count: x.SoLuong,
  }));

  const sachTheoTheLoai = rp3.map((x) => ({ name: x.TenTheLoai, value: x.SoLuong }));

  return (
    <div className="space-y-8">
      <PageHeader title="Tổng quan" description="Cái nhìn nhanh về tình trạng thư viện hôm nay." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng số sách"
          value={rp1?.TongSoSach ?? 0}
          icon={BookOpen}
          hint={`${rp1?.TongDauSach ?? 0} đầu sách`}
        />
        <StatCard
          label="Đang có sẵn"
          value={rp1?.DangCoSan ?? 0}
          icon={Library}
          tone="success"
        />
        <StatCard label="Độc giả" value={rp1?.TongDocGia ?? 0} icon={Users} />
        <StatCard
          label="Phiếu quá hạn"
          value={rp1?.PhieuQuaHan ?? 0}
          icon={AlertTriangle}
          tone="destructive"
        />
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
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
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
                  <Pie
                    data={sachTheoTheLoai}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {sachTheoTheLoai.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top sách được mượn</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/sach">
              Xem sách <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rp4} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="TenSach"
                  type="category"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  width={180}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="TongLuotMuon" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phiếu mượn quá hạn</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/phieu-muon">
              <BookMarked className="mr-1 h-4 w-4" /> Phiếu mượn
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phiếu</TableHead>
                <TableHead>Độc giả</TableHead>
                <TableHead>Ngày mượn</TableHead>
                <TableHead>Hạn trả</TableHead>
                <TableHead className="text-right">Số ngày quá hạn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rp5.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                    Không có phiếu quá hạn 🎉
                  </TableCell>
                </TableRow>
              ) : (
                rp5.map((r) => (
                  <TableRow key={r.MaPhieuMuon}>
                    <TableCell>#{r.MaPhieuMuon}</TableCell>
                    <TableCell>{r.HoTen}</TableCell>
                    <TableCell>{fmtDate(r.NgayMuon)}</TableCell>
                    <TableCell>{fmtDate(r.HanTra)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{r.SoNgayQuaHan} ngày</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
