import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";
import { MemberFormDialog } from "@/components/members/MemberFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Member } from "@/types/library";

export const Route = createFileRoute("/members")({
  component: MembersPage,
  head: () => ({ meta: [{ title: "Độc giả – Quản lý thư viện" }] }),
});

function MembersPage() {
  const { members, loans, addMember, updateMember, deleteMember } = useLibrary();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Member | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      members.filter(
        (m) =>
          !query ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.email.toLowerCase().includes(query.toLowerCase()) ||
          m.phone.includes(query)
      ),
    [members, query]
  );

  const loanCountByMember = useMemo(() => {
    const map = new Map<string, number>();
    loans.forEach((l) => map.set(l.memberId, (map.get(l.memberId) ?? 0) + 1));
    return map;
  }, [loans]);

  const handleExport = () => {
    exportToCSV(`doc-gia-${new Date().toISOString().slice(0, 10)}`, filtered, [
      { key: "id", label: "Mã" },
      { key: "name", label: "Họ tên" },
      { key: "email", label: "Email" },
      { key: "phone", label: "SĐT" },
      { key: "joinedAt", label: "Ngày tham gia" },
      { key: "status", label: "Trạng thái" },
    ]);
    toast.success("Đã xuất file CSV");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý độc giả"
        description={`${members.length} độc giả`}
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Xuất CSV
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm độc giả
            </Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Tìm theo tên, email hoặc SĐT..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Tham gia</TableHead>
              <TableHead className="text-center">Lượt mượn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Không có độc giả phù hợp
                </TableCell>
              </TableRow>
            )}
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>{m.joinedAt}</TableCell>
                <TableCell className="text-center">{loanCountByMember.get(m.id) ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={m.status === "active" ? "default" : "secondary"}>
                    {m.status === "active" ? "Hoạt động" : "Ngưng"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(m);
                      setOpenForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <MemberFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateMember(editing.id, data);
            toast.success("Đã cập nhật");
          } else {
            addMember(data);
            toast.success("Đã thêm độc giả");
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xoá độc giả?"
        onConfirm={() => {
          if (deleteId) {
            deleteMember(deleteId);
            toast.success("Đã xoá");
          }
        }}
      />
    </div>
  );
}
