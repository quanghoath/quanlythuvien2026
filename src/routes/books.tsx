import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLibrary } from "@/store/libraryStore";
import { exportToCSV } from "@/lib/export";
import { BookFormDialog } from "@/components/books/BookFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Book } from "@/types/library";

export const Route = createFileRoute("/books")({
  component: BooksPage,
  head: () => ({ meta: [{ title: "Sách – Quản lý thư viện" }] }),
});

function BooksPage() {
  const { books, categories, addBook, updateBook, deleteBook } = useLibrary();
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [editing, setEditing] = useState<Book | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchQ =
        !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.isbn.toLowerCase().includes(query.toLowerCase());
      const matchC = filterCat === "all" || b.categoryId === filterCat;
      return matchQ && matchC;
    });
  }, [books, query, filterCat]);

  const handleExport = () => {
    exportToCSV(
      `sach-${new Date().toISOString().slice(0, 10)}`,
      filtered.map((b) => ({
        ...b,
        category: categories.find((c) => c.id === b.categoryId)?.name ?? "",
      })),
      [
        { key: "id", label: "Mã" },
        { key: "title", label: "Tên sách" },
        { key: "author", label: "Tác giả" },
        { key: "isbn", label: "ISBN" },
        { key: "category", label: "Thể loại" },
        { key: "publisher", label: "NXB" },
        { key: "year", label: "Năm" },
        { key: "total", label: "Tổng" },
        { key: "available", label: "Còn lại" },
      ]
    );
    toast.success("Đã xuất file CSV");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý sách"
        description={`${books.length} đầu sách trong kho`}
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
              <Plus className="mr-2 h-4 w-4" /> Thêm sách
            </Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Tìm theo tên, tác giả hoặc ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thể loại</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sách</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Thể loại</TableHead>
              <TableHead>NXB</TableHead>
              <TableHead className="text-center">Năm</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Không có sách phù hợp
                </TableCell>
              </TableRow>
            )}
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-xs text-muted-foreground">ISBN: {b.isbn}</div>
                </TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{categories.find((c) => c.id === b.categoryId)?.name ?? "—"}</TableCell>
                <TableCell>{b.publisher}</TableCell>
                <TableCell className="text-center">{b.year}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={b.available === 0 ? "destructive" : b.available < b.total / 2 ? "secondary" : "default"}>
                    {b.available}/{b.total}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(b);
                      setOpenForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(b.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <BookFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        categories={categories}
        onSubmit={(data) => {
          if (editing) {
            updateBook(editing.id, data);
            toast.success("Đã cập nhật sách");
          } else {
            const { available, ...rest } = data;
            addBook(rest);
            toast.success("Đã thêm sách mới");
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xoá sách?"
        description="Sách sẽ bị xoá khỏi kho. Bạn có chắc chắn?"
        onConfirm={() => {
          if (deleteId) {
            deleteBook(deleteId);
            toast.success("Đã xoá sách");
          }
        }}
      />
    </div>
  );
}
