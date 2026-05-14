import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";
import { LoanFormDialog } from "@/components/loans/LoanFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export const Route = createFileRoute("/loans")({
  component: LoansPage,
  head: () => ({ meta: [{ title: "Mượn / Trả – Quản lý thư viện" }] }),
});

function LoansPage() {
  const { loans, books, members, addLoan, returnLoan, deleteLoan } = useLibrary();
  const [tab, setTab] = useState<"all" | "borrowing" | "overdue" | "returned">("all");
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      loans
        .map((l) => ({
          ...l,
          bookTitle: books.find((b) => b.id === l.bookId)?.title ?? "—",
          memberName: members.find((m) => m.id === l.memberId)?.name ?? "—",
          isOverdue: l.status !== "returned" && new Date(l.dueAt) < new Date(),
        }))
        .map((l) => ({ ...l, status: l.isOverdue ? ("overdue" as const) : l.status })),
    [loans, books, members]
  );

  const filtered = useMemo(
    () => (tab === "all" ? enriched : enriched.filter((l) => l.status === tab)),
    [enriched, tab]
  );

  const handleExport = () => {
    exportToCSV(`muon-tra-${new Date().toISOString().slice(0, 10)}`, filtered, [
      { key: "id", label: "Mã phiếu" },
      { key: "bookTitle", label: "Sách" },
      { key: "memberName", label: "Độc giả" },
      { key: "borrowedAt", label: "Ngày mượn" },
      { key: "dueAt", label: "Hạn trả" },
      { key: "returnedAt", label: "Ngày trả" },
      { key: "status", label: "Trạng thái" },
    ]);
    toast.success("Đã xuất file CSV");
  };

  const counts = useMemo(
    () => ({
      all: enriched.length,
      borrowing: enriched.filter((l) => l.status === "borrowing").length,
      overdue: enriched.filter((l) => l.status === "overdue").length,
      returned: enriched.filter((l) => l.status === "returned").length,
    }),
    [enriched]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mượn / Trả sách"
        description="Theo dõi và quản lý các phiếu mượn"
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Xuất CSV
            </Button>
            <Button onClick={() => setOpenForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Tạo phiếu mượn
            </Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
          <TabsTrigger value="borrowing">Đang mượn ({counts.borrowing})</TabsTrigger>
          <TabsTrigger value="overdue">Quá hạn ({counts.overdue})</TabsTrigger>
          <TabsTrigger value="returned">Đã trả ({counts.returned})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sách</TableHead>
              <TableHead>Độc giả</TableHead>
              <TableHead>Ngày mượn</TableHead>
              <TableHead>Hạn trả</TableHead>
              <TableHead>Ngày trả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Không có phiếu mượn
                </TableCell>
              </TableRow>
            )}
            {filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.bookTitle}</TableCell>
                <TableCell>{l.memberName}</TableCell>
                <TableCell>{l.borrowedAt}</TableCell>
                <TableCell>{l.dueAt}</TableCell>
                <TableCell>{l.returnedAt ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      l.status === "overdue"
                        ? "destructive"
                        : l.status === "returned"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {l.status === "overdue" ? "Quá hạn" : l.status === "returned" ? "Đã trả" : "Đang mượn"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {l.status !== "returned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        returnLoan(l.id);
                        toast.success("Đã ghi nhận trả sách");
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" /> Trả
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(l.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <LoanFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        books={books}
        members={members}
        onSubmit={(data) => {
          addLoan(data);
          toast.success("Đã tạo phiếu mượn");
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xoá phiếu mượn?"
        onConfirm={() => {
          if (deleteId) {
            deleteLoan(deleteId);
            toast.success("Đã xoá");
          }
        }}
      />
    </div>
  );
}
