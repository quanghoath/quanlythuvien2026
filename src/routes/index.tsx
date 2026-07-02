import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  BookMarked,
  AlertTriangle,
  ArrowRight,
  Library,
  Clock3,
} from "lucide-react";
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
    baocaoApi
      .getRp1()
      .then((r) => setRp1(r.data.data))
      .catch(() => {});
    baocaoApi
      .getRp2()
      .then((r) => setRp2(r.data.data ?? []))
      .catch(() => {});
    baocaoApi
      .getRp3()
      .then((r) => setRp3(r.data.data ?? []))
      .catch(() => {});
    baocaoApi
      .getRp4()
      .then((r) => setRp4(r.data.data ?? []))
      .catch(() => {});
    baocaoApi
      .getRp5()
      .then((r) => setRp5(r.data.data ?? []))
      .catch(() => {});
  }, []);

  const muonTheoThang = rp2.map((x) => ({
    month: `${x.Thang}/${x.Nam}`,
    count: x.SoLuong,
  }));

  const sachTheoTheLoai = rp3.map((x) => ({ name: x.TenTheLoai, value: x.SoLuong }));
  const tongMuon6Thang = muonTheoThang.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tổng quan"
        description="Cái nhìn nhanh về tồn kho, hoạt động mượn trả và những điểm cần xử lý trong ngày."
      />

      <Card className="overflow-hidden border-border/75">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr] lg:p-6">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Operations summary
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Thư viện đang vận hành với {rp1?.TongSoSach ?? 0} cuốn sách và{" "}
                {rp1?.TongDocGia ?? 0} độc giả.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                Khu vực này tổng hợp các tín hiệu quan trọng nhất để thủ thư ưu tiên xử lý, từ tình
                trạng sẵn sàng của kho đến các phiếu quá hạn cần theo dõi.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Lượt mượn 6 tháng
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {tongMuon6Thang}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Thể loại đang theo dõi
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {sachTheoTheLoai.length}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Phiếu quá hạn
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-destructive">
                {rp5.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng số sách"
          value={rp1?.TongSoSach ?? 0}
          icon={BookOpen}
          hint={`${rp1?.TongDauSach ?? 0} đầu sách`}
        />
        <StatCard label="Đang có sẵn" value={rp1?.DangCoSan ?? 0} icon={Library} tone="success" />
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
          <CardHeader className="border-b border-border/70">
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
          <CardHeader className="border-b border-border/70">
            <CardTitle>Sách theo thể loại</CardTitle>
          </CardHeader>
          <CardContent>
            {sachTheoTheLoai.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Library className="h-5 w-5" />
                </div>
                <p className="font-medium text-foreground">Chưa có dữ liệu thể loại</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  Biểu đồ sẽ xuất hiện khi hệ thống có dữ liệu phân bổ sách theo thể loại.
                </p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
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
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
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
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-success/12 text-success">
                        <Clock3 className="h-5 w-5" />
                      </div>
                      Không có phiếu quá hạn cần xử lý.
                    </div>
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
