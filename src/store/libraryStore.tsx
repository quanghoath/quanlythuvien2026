import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Book, Category, Loan, Member } from "@/types/library";
import { mockBooks, mockCategories, mockLoans, mockMembers } from "@/data/mockData";

type LibraryContextValue = {
  books: Book[];
  members: Member[];
  loans: Loan[];
  categories: Category[];
  // Books
  addBook: (b: Omit<Book, "id" | "available">) => void;
  updateBook: (id: string, b: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  // Members
  addMember: (m: Omit<Member, "id">) => void;
  updateMember: (id: string, m: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  // Loans
  addLoan: (l: Omit<Loan, "id" | "status" | "returnedAt">) => void;
  returnLoan: (id: string) => void;
  deleteLoan: (id: string) => void;
  // Categories
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const uid = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 8)}`;

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const value = useMemo<LibraryContextValue>(
    () => ({
      books,
      members,
      loans,
      categories,
      addBook: (b) =>
        setBooks((prev) => [...prev, { ...b, id: uid("b"), available: b.total }]),
      updateBook: (id, b) =>
        setBooks((prev) => prev.map((x) => (x.id === id ? { ...x, ...b } : x))),
      deleteBook: (id) => setBooks((prev) => prev.filter((x) => x.id !== id)),

      addMember: (m) => setMembers((prev) => [...prev, { ...m, id: uid("m") }]),
      updateMember: (id, m) =>
        setMembers((prev) => prev.map((x) => (x.id === id ? { ...x, ...m } : x))),
      deleteMember: (id) => setMembers((prev) => prev.filter((x) => x.id !== id)),

      addLoan: (l) => {
        const isOverdue = new Date(l.dueAt) < new Date();
        setLoans((prev) => [
          ...prev,
          { ...l, id: uid("l"), returnedAt: null, status: isOverdue ? "overdue" : "borrowing" },
        ]);
        setBooks((prev) =>
          prev.map((b) => (b.id === l.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b))
        );
      },
      returnLoan: (id) => {
        setLoans((prev) => {
          const loan = prev.find((x) => x.id === id);
          if (loan && loan.status !== "returned") {
            setBooks((bks) =>
              bks.map((b) =>
                b.id === loan.bookId ? { ...b, available: Math.min(b.total, b.available + 1) } : b
              )
            );
          }
          return prev.map((x) =>
            x.id === id ? { ...x, returnedAt: new Date().toISOString().slice(0, 10), status: "returned" } : x
          );
        });
      },
      deleteLoan: (id) => setLoans((prev) => prev.filter((x) => x.id !== id)),

      addCategory: (c) => setCategories((prev) => [...prev, { ...c, id: uid("c") }]),
      updateCategory: (id, c) =>
        setCategories((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x))),
      deleteCategory: (id) => setCategories((prev) => prev.filter((x) => x.id !== id)),
    }),
    [books, members, loans, categories]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
