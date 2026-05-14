export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  publisher: string;
  year: number;
  total: number;
  available: number;
  cover?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string; // ISO date
  status: "active" | "inactive";
};

export type Loan = {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: "borrowing" | "returned" | "overdue";
};
