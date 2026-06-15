import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";

export const Route = createFileRoute("/bao-cao")({ component: Page });

const today = () => new Date().toISOString().slice(0, 10);
const fmtMoney = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

function Page() {
  const { sach, docGia, phieuMuon, chiTietPhieuMuon, phieuTra, theLoai } = useLibrary();

  const topSach = useMemo(() => {
    const map = new Map<number, number>();
    chiTietPhieuMuon.forEach((c) => map.set(c.MaSach, (map.get(c.MaSach) ?? 0) + c.SoLuong));
    return Array.from(map.entries())
      .map(([id, count]) => ({
        ten: sach.find((s) => s.MaSach === id)?.TenSach ?? `#${id}`,
        luot: count,
      }))
      .sort((a, b) => b.luot - a.luot)
      .slice(0, 8);
  }, [chiTietPhieuMuon, sach]);

  const quaHan = useMemo(() => {
    const t = today();
    return phieuMuon
      .filter((pm) => !phieuTra.some((pt) => pt.MaPhieuMuon === pm.MaPhieuMuon) && pm.HanTra < t)
      .map((pm) => ({
        MaPhieuMuon: pm.MaPhieuMuon,
        DocGia: docGia.find((d) => d.MaDocGia === pm.MaDocGia)?.HoTen ?? "—",
        NgayMuon: pm.NgayMuon,
        HanTra: pm.HanTra,
        SoNgayQua: Math.floor((Date.now() - new Date(pm.HanTra).getTime()) / 86400000),
      }));
  }, [phieuMuon, phieuTra, docGia]);

  const tongPhat = useMemo(() => phieuTra.reduce((s, x) => s + x.TienPhat, 0), [phieuTra]);

  const sachTheoTheLoai = useMemo(
    () => theLoai.map((c) => ({
      name: c.TenTheLoai,
      so: sach.filter((s) => s.MaTheLoai === c.MaTheLoai).reduce((s, b) => s + b.SoLuong, 0),
    })),
    [theLoai, sach]
  );

  return (
    <div className="space-y-8">
      <PageHeader title="Báo cáo" description="Tổng hợp các chỉ số quan trọng của thư viện." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Tổng phiếu mượn</CardTitle></CardHeader>
          <CardContent><p className="font-display text-3xl font-semibold">{phieuMuon.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Tổng tiền phạt</CardTitle></CardHeader>
          <CardContent><p className="font-display text-3xl font-semibold">{fmtMoney(tongPhat)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Phiếu quá hạn</CardTitle></CardHeader>
          <CardContent><p className="font-display text-3xl font-semibold text-destructive">{quaHan.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top sách được mượn</CardTitle>
          <Button variant="outline" size="sm" onClick={() => exportToCSV("top-sach", topSach)}>
            <Download className="mr-2 h-4 w-4" /> Xuất CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSach} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="ten" type="category" stroke="var(--muted-foreground)" fontSize={11} width={160} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="luot" fill="var(--primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sách theo thể loại</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sachTheoTheLoai}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="so" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phiếu mượn quá hạn</CardTitle>
          <Button variant="outline" size="sm" disabled={quaHan.length === 0} onClick={() => exportToCSV("phieu-qua-han", quaHan)}>
            <Download className="mr-2 h-4 w-4" /> Xuất CSV
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
              {quaHan.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">Không có phiếu quá hạn 🎉</TableCell></TableRow>
              ) : quaHan.map((r) => (
                <TableRow key={r.MaPhieuMuon}>
                  <TableCell>#{r.MaPhieuMuon}</TableCell>
                  <TableCell>{r.DocGia}</TableCell>
                  <TableCell>{r.NgayMuon}</TableCell>
                  <TableCell>{r.HanTra}</TableCell>
                  <TableCell className="text-right"><Badge variant="destructive">{r.SoNgayQua} ngày</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
