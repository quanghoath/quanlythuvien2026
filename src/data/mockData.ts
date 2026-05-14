import type { Book, Category, Loan, Member } from "@/types/library";

export const mockCategories: Category[] = [
  { id: "c1", name: "Văn học", description: "Tiểu thuyết, truyện ngắn, thơ ca" },
  { id: "c2", name: "Khoa học", description: "Sách khoa học tự nhiên & ứng dụng" },
  { id: "c3", name: "Công nghệ", description: "Lập trình, kỹ thuật, công nghệ thông tin" },
  { id: "c4", name: "Lịch sử", description: "Sách lịch sử Việt Nam và thế giới" },
  { id: "c5", name: "Kinh tế", description: "Quản trị, tài chính, marketing" },
  { id: "c6", name: "Thiếu nhi", description: "Sách dành cho trẻ em" },
];

export const mockBooks: Book[] = [
  { id: "b1", title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", isbn: "978-604-1-00001", categoryId: "c1", publisher: "Kim Đồng", year: 2019, total: 10, available: 7 },
  { id: "b2", title: "Số Đỏ", author: "Vũ Trọng Phụng", isbn: "978-604-1-00002", categoryId: "c1", publisher: "Văn Học", year: 2018, total: 8, available: 5 },
  { id: "b3", title: "Vũ Trụ Trong Vỏ Hạt Dẻ", author: "Stephen Hawking", isbn: "978-604-2-00003", categoryId: "c2", publisher: "Trẻ", year: 2020, total: 6, available: 3 },
  { id: "b4", title: "Clean Code", author: "Robert C. Martin", isbn: "978-013-235088-4", categoryId: "c3", publisher: "Prentice Hall", year: 2008, total: 12, available: 9 },
  { id: "b5", title: "JavaScript Tinh Hoa", author: "Douglas Crockford", isbn: "978-604-3-00005", categoryId: "c3", publisher: "O'Reilly", year: 2017, total: 7, available: 4 },
  { id: "b6", title: "Đại Việt Sử Ký Toàn Thư", author: "Ngô Sĩ Liên", isbn: "978-604-4-00006", categoryId: "c4", publisher: "KHXH", year: 2015, total: 5, available: 2 },
  { id: "b7", title: "Người Giàu Nhất Thành Babylon", author: "George S. Clason", isbn: "978-604-5-00007", categoryId: "c5", publisher: "First News", year: 2021, total: 15, available: 11 },
  { id: "b8", title: "Đắc Nhân Tâm", author: "Dale Carnegie", isbn: "978-604-5-00008", categoryId: "c5", publisher: "Trẻ", year: 2020, total: 20, available: 14 },
  { id: "b9", title: "Doraemon Tập 1", author: "Fujiko F. Fujio", isbn: "978-604-6-00009", categoryId: "c6", publisher: "Kim Đồng", year: 2022, total: 25, available: 20 },
  { id: "b10", title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", isbn: "978-604-2-00010", categoryId: "c2", publisher: "Thế Giới", year: 2019, total: 9, available: 6 },
];

export const mockMembers: Member[] = [
  { id: "m1", name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0901234567", joinedAt: "2024-01-15", status: "active" },
  { id: "m2", name: "Trần Thị Bích", email: "bich.tran@email.com", phone: "0912345678", joinedAt: "2024-02-20", status: "active" },
  { id: "m3", name: "Lê Hoàng Cường", email: "cuong.le@email.com", phone: "0923456789", joinedAt: "2023-11-05", status: "active" },
  { id: "m4", name: "Phạm Thu Dung", email: "dung.pham@email.com", phone: "0934567890", joinedAt: "2024-03-10", status: "inactive" },
  { id: "m5", name: "Hoàng Minh Đức", email: "duc.hoang@email.com", phone: "0945678901", joinedAt: "2024-05-22", status: "active" },
  { id: "m6", name: "Vũ Thị Hà", email: "ha.vu@email.com", phone: "0956789012", joinedAt: "2024-06-01", status: "active" },
  { id: "m7", name: "Đặng Quốc Khánh", email: "khanh.dang@email.com", phone: "0967890123", joinedAt: "2023-09-18", status: "active" },
];

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const daysFromNow = (n: number) => daysAgo(-n);

export const mockLoans: Loan[] = [
  { id: "l1", bookId: "b1", memberId: "m1", borrowedAt: daysAgo(5), dueAt: daysFromNow(9), returnedAt: null, status: "borrowing" },
  { id: "l2", bookId: "b4", memberId: "m2", borrowedAt: daysAgo(20), dueAt: daysAgo(6), returnedAt: null, status: "overdue" },
  { id: "l3", bookId: "b8", memberId: "m3", borrowedAt: daysAgo(30), dueAt: daysAgo(16), returnedAt: daysAgo(10), status: "returned" },
  { id: "l4", bookId: "b7", memberId: "m5", borrowedAt: daysAgo(2), dueAt: daysFromNow(12), returnedAt: null, status: "borrowing" },
  { id: "l5", bookId: "b3", memberId: "m6", borrowedAt: daysAgo(45), dueAt: daysAgo(31), returnedAt: daysAgo(28), status: "returned" },
  { id: "l6", bookId: "b10", memberId: "m7", borrowedAt: daysAgo(8), dueAt: daysFromNow(6), returnedAt: null, status: "borrowing" },
  { id: "l7", bookId: "b5", memberId: "m1", borrowedAt: daysAgo(25), dueAt: daysAgo(11), returnedAt: null, status: "overdue" },
  { id: "l8", bookId: "b9", memberId: "m2", borrowedAt: daysAgo(60), dueAt: daysAgo(46), returnedAt: daysAgo(40), status: "returned" },
  { id: "l9", bookId: "b2", memberId: "m3", borrowedAt: daysAgo(1), dueAt: daysFromNow(13), returnedAt: null, status: "borrowing" },
  { id: "l10", bookId: "b6", memberId: "m5", borrowedAt: daysAgo(90), dueAt: daysAgo(76), returnedAt: daysAgo(70), status: "returned" },
];
