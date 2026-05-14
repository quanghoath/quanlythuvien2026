import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download, TrendingUp, AlertTriangle, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Báo cáo – Quản lý thư viện" }] }),
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)"];

function ReportsPage() {
  const { books, members, loans, categories } = useLibrary();

  // Top borrowed books
  const topBooks = useMemo(() => {
    const m = new Map<string, number>();
    loans.forEach((l) => m.set(l.bookId, (m.get(l.bookId) ?? 0) + 1));
    return Array.from(m.entries())
      .map(([bookId, count]) => ({
        id: bookId,
        title: books.find((b) => b.id === bookId)?.title ?? "—",
        author: books.find((b) => b.id === bookId)?.author ?? "—",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [loans, books]);

  // Top members
  const topMembers = useMemo(() => {
    const m = new Map<string, number>();
    loans.forEach((l) => m.set(l.memberId, (m.get(l.memberId) ?? 0) + 1));
    return Array.from(m.entries())
      .map(([memberId, count]) => ({
        id: memberId,
        name: members.find((mm) => mm.id === memberId)?.name ?? "—",
        email: members.find((mm) => mm.id === memberId)?.email ?? "—",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [loans, members]);

  // Loans trend (12 months)
  const trend = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      map.set(`${d.getMonth() + 1}/${d.getFullYear()}`, 0);
    }
    loans.forEach((l) => {
      const d = new Date(l.borrowedAt);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
  }, [loans]);

  const byCategory = useMemo(
    () =>
      categories.map((c) => ({
        name: c.name,
        sách: books.filter((b) => b.categoryId === c.id).reduce((s, b) => s + b.total, 0),
        mượn: loans.filter((l) => books.find((b) => b.id === l.bookId)?.categoryId === c.id).length,
      })),
    [categories, books, loans]
  );

  const overdueList = useMemo(
    () =>
      loans
        .filter((l) => l.status !== "returned" && new Date(l.dueAt) < new Date())
        .map((l) => ({
          id: l.id,
          book: books.find((b) => b.id === l.bookId)?.title ?? "—",
          member: members.find((m) => m.id === l.memberId)?.name ?? "—",
          dueAt: l.dueAt,
          daysOverdue: Math.floor((Date.now() - new Date(l.dueAt).getTime()) / (1000 * 60 * 60 * 24)),
        })),
    [loans, books, members]
  );

  const handleExportFull = () => {
    exportToCSV(`bao-cao-tong-hop-${new Date().toISOString().slice(0, 10)}`, [
      { metric: "Tổng đầu sách", value: books.length },
      { metric: "Tổng số bản", value: books.reduce((s, b) => s + b.total, 0) },
      { metric: "Sách đang có sẵn", value: books.reduce((s, b) => s + b.available, 0) },
      { metric: "Tổng độc giả", value: members.length },
      { metric: "Độc giả hoạt động", value: members.filter((m) => m.status === "active").length },
      { metric: "Tổng phiếu mượn", value: loans.length },
      { metric: "Đang mượn", value: loans.filter((l) => l.status === "borrowing").length },
      { metric: "Quá hạn", value: overdueList.length },
      { metric: "Đã trả", value: loans.filter((l) => l.status === "returned").length },
    ]);
    toast.success("Đã xuất báo cáo tổng hợp");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Báo cáo & thống kê"
        description="Phân tích hoạt động của thư viện"
        actions={
          <Button onClick={handleExportFull}>
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo tổng hợp
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng lượt mượn" value={loans.length} icon={TrendingUp} />
        <StatCard label="Đang mượn" value={loans.filter((l) => l.status === "borrowing").length} icon={BookOpen} tone="success" />
        <StatCard label="Quá hạn" value={overdueList.length} icon={AlertTriangle} tone="destructive" />
        <StatCard label="Tỷ lệ độc giả tích cực" value={`${Math.round((topMembers.length / Math.max(members.length, 1)) * 100)}%`} icon={Users} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng mượn sách 12 tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sách & lượt mượn theo thể loại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="sách" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="mượn" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố lượt mượn theo thể loại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="mượn" nameKey="name" outerRadius={90}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top sách được mượn nhiều</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                exportToCSV("top-sach", topBooks);
                toast.success("Đã xuất");
              }}
            >
              <Download className="mr-1 h-4 w-4" /> CSV
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sách</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead className="text-right">Lượt mượn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBooks.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell className="text-right">
                      <Badge>{b.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Độc giả tích cực</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                exportToCSV("top-doc-gia", topMembers);
                toast.success("Đã xuất");
              }}
            >
              <Download className="mr-1 h-4 w-4" /> CSV
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Lượt mượn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell className="text-right">
                      <Badge>{m.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách sách quá hạn</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              exportToCSV("qua-han", overdueList);
              toast.success("Đã xuất");
            }}
          >
            <Download className="mr-1 h-4 w-4" /> CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sách</TableHead>
                <TableHead>Độc giả</TableHead>
                <TableHead>Hạn trả</TableHead>
                <TableHead className="text-right">Số ngày trễ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    Không có sách nào quá hạn 🎉
                  </TableCell>
                </TableRow>
              )}
              {overdueList.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.book}</TableCell>
                  <TableCell>{o.member}</TableCell>
                  <TableCell>{o.dueAt}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">{o.daysOverdue} ngày</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
