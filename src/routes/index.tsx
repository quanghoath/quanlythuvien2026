import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookOpen, Users, BookMarked, AlertTriangle, ArrowRight } from "lucide-react";
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

function DashboardPage() {
  const { books, members, loans, categories } = useLibrary();

  const stats = useMemo(() => {
    const totalBooks = books.reduce((s, b) => s + b.total, 0);
    const availableBooks = books.reduce((s, b) => s + b.available, 0);
    const borrowing = loans.filter((l) => l.status !== "returned").length;
    const overdue = loans.filter((l) => l.status === "overdue").length;
    return { totalBooks, availableBooks, borrowing, overdue };
  }, [books, loans]);

  const byCategory = useMemo(
    () =>
      categories.map((c) => ({
        name: c.name,
        value: books.filter((b) => b.categoryId === c.id).reduce((s, b) => s + b.total, 0),
      })),
    [categories, books]
  );

  const loansByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      map.set(key, 0);
    }
    loans.forEach((l) => {
      const d = new Date(l.borrowedAt);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
  }, [loans]);

  const recentLoans = useMemo(
    () =>
      [...loans]
        .sort((a, b) => b.borrowedAt.localeCompare(a.borrowedAt))
        .slice(0, 5)
        .map((l) => ({
          ...l,
          bookTitle: books.find((b) => b.id === l.bookId)?.title ?? "—",
          memberName: members.find((m) => m.id === l.memberId)?.name ?? "—",
        })),
    [loans, books, members]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tổng quan"
        description="Cái nhìn nhanh về tình trạng thư viện hôm nay."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng số sách" value={stats.totalBooks} icon={BookOpen} hint={`${books.length} đầu sách`} />
        <StatCard label="Đang có sẵn" value={stats.availableBooks} icon={BookMarked} tone="success" />
        <StatCard label="Độc giả" value={members.length} icon={Users} hint={`${members.filter((m) => m.status === "active").length} hoạt động`} />
        <StatCard label="Quá hạn" value={stats.overdue} icon={AlertTriangle} tone="destructive" hint={`${stats.borrowing} đang mượn`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lượt mượn 6 tháng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
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
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
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
          <CardTitle>Hoạt động mượn gần đây</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/loans">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recentLoans.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{l.bookTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {l.memberName} · mượn ngày {l.borrowedAt}
                  </p>
                </div>
                <Badge
                  variant={l.status === "overdue" ? "destructive" : l.status === "returned" ? "secondary" : "default"}
                >
                  {l.status === "overdue" ? "Quá hạn" : l.status === "returned" ? "Đã trả" : "Đang mượn"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
