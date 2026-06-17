import type {
  ChiTietPhieuMuon,
  DocGia,
  NhatKySach,
  PhieuMuon,
  PhieuTra,
  Sach,
  TacGia,
  TaiKhoan,
  TheLoai,
  VaiTro,
} from "@/types/library";

export const mockVaiTro: VaiTro[] = [
  { MaVaiTro: 1, TenVaiTro: "Quản trị viên" },
  { MaVaiTro: 2, TenVaiTro: "Thủ thư" },
  { MaVaiTro: 3, TenVaiTro: "Nhân viên" },
];

export const mockTaiKhoan: TaiKhoan[] = [
  {
    MaTaiKhoan: 1,
    TenDangNhap: "admin",
    MatKhau: "admin123",
    HoTen: "Nguyễn Quản Trị",
    MaVaiTro: 1,
  },
  { MaTaiKhoan: 2, TenDangNhap: "thuthu", MatKhau: "123456", HoTen: "Trần Thị Thư", MaVaiTro: 2 },
  { MaTaiKhoan: 3, TenDangNhap: "nhanvien", MatKhau: "123456", HoTen: "Lê Văn Nhân", MaVaiTro: 3 },
];

export const mockTacGia: TacGia[] = [
  { MaTacGia: 1, TenTacGia: "Tô Hoài" },
  { MaTacGia: 2, TenTacGia: "Vũ Trọng Phụng" },
  { MaTacGia: 3, TenTacGia: "Stephen Hawking" },
  { MaTacGia: 4, TenTacGia: "Robert C. Martin" },
  { MaTacGia: 5, TenTacGia: "Douglas Crockford" },
  { MaTacGia: 6, TenTacGia: "Dale Carnegie" },
  { MaTacGia: 7, TenTacGia: "Yuval Noah Harari" },
  { MaTacGia: 8, TenTacGia: "Fujiko F. Fujio" },
];

export const mockTheLoai: TheLoai[] = [
  { MaTheLoai: 1, TenTheLoai: "Văn học" },
  { MaTheLoai: 2, TenTheLoai: "Khoa học" },
  { MaTheLoai: 3, TenTheLoai: "Công nghệ" },
  { MaTheLoai: 4, TenTheLoai: "Lịch sử" },
  { MaTheLoai: 5, TenTheLoai: "Kinh tế" },
  { MaTheLoai: 6, TenTheLoai: "Thiếu nhi" },
];

export const mockSach: Sach[] = [
  {
    MaSach: 1,
    TenSach: "Dế Mèn Phiêu Lưu Ký",
    MaTacGia: 1,
    MaTheLoai: 1,
    NamXuatBan: 2019,
    SoLuong: 10,
    SoLuongCon: 7,
  },
  {
    MaSach: 2,
    TenSach: "Số Đỏ",
    MaTacGia: 2,
    MaTheLoai: 1,
    NamXuatBan: 2018,
    SoLuong: 8,
    SoLuongCon: 5,
  },
  {
    MaSach: 3,
    TenSach: "Vũ Trụ Trong Vỏ Hạt Dẻ",
    MaTacGia: 3,
    MaTheLoai: 2,
    NamXuatBan: 2020,
    SoLuong: 6,
    SoLuongCon: 3,
  },
  {
    MaSach: 4,
    TenSach: "Clean Code",
    MaTacGia: 4,
    MaTheLoai: 3,
    NamXuatBan: 2008,
    SoLuong: 12,
    SoLuongCon: 9,
  },
  {
    MaSach: 5,
    TenSach: "JavaScript Tinh Hoa",
    MaTacGia: 5,
    MaTheLoai: 3,
    NamXuatBan: 2017,
    SoLuong: 7,
    SoLuongCon: 4,
  },
  {
    MaSach: 6,
    TenSach: "Sapiens: Lược Sử Loài Người",
    MaTacGia: 7,
    MaTheLoai: 2,
    NamXuatBan: 2019,
    SoLuong: 9,
    SoLuongCon: 6,
  },
  {
    MaSach: 7,
    TenSach: "Đắc Nhân Tâm",
    MaTacGia: 6,
    MaTheLoai: 5,
    NamXuatBan: 2020,
    SoLuong: 20,
    SoLuongCon: 14,
  },
  {
    MaSach: 8,
    TenSach: "Doraemon Tập 1",
    MaTacGia: 8,
    MaTheLoai: 6,
    NamXuatBan: 2022,
    SoLuong: 25,
    SoLuongCon: 20,
  },
];

export const mockDocGia: DocGia[] = [
  { MaDocGia: 1, HoTen: "Nguyễn Văn An", SoDienThoai: "0901234567", DiaChi: "Hà Nội" },
  { MaDocGia: 2, HoTen: "Trần Thị Bích", SoDienThoai: "0912345678", DiaChi: "TP. HCM" },
  { MaDocGia: 3, HoTen: "Lê Hoàng Cường", SoDienThoai: "0923456789", DiaChi: "Đà Nẵng" },
  { MaDocGia: 4, HoTen: "Phạm Thu Dung", SoDienThoai: "0934567890", DiaChi: "Hải Phòng" },
  { MaDocGia: 5, HoTen: "Hoàng Minh Đức", SoDienThoai: "0945678901", DiaChi: "Cần Thơ" },
];

const today = new Date();
const dayStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const mockPhieuMuon: PhieuMuon[] = [
  { MaPhieuMuon: 1, MaDocGia: 1, NgayMuon: dayStr(-5), HanTra: dayStr(9) },
  { MaPhieuMuon: 2, MaDocGia: 2, NgayMuon: dayStr(-20), HanTra: dayStr(-6) },
  { MaPhieuMuon: 3, MaDocGia: 3, NgayMuon: dayStr(-30), HanTra: dayStr(-16) },
  { MaPhieuMuon: 4, MaDocGia: 5, NgayMuon: dayStr(-2), HanTra: dayStr(12) },
  { MaPhieuMuon: 5, MaDocGia: 1, NgayMuon: dayStr(-25), HanTra: dayStr(-11) },
];

export const mockChiTietPhieuMuon: ChiTietPhieuMuon[] = [
  { MaChiTiet: 1, MaPhieuMuon: 1, MaSach: 1, SoLuong: 1 },
  { MaChiTiet: 2, MaPhieuMuon: 1, MaSach: 4, SoLuong: 1 },
  { MaChiTiet: 3, MaPhieuMuon: 2, MaSach: 4, SoLuong: 1 },
  { MaChiTiet: 4, MaPhieuMuon: 3, MaSach: 7, SoLuong: 2 },
  { MaChiTiet: 5, MaPhieuMuon: 4, MaSach: 6, SoLuong: 1 },
  { MaChiTiet: 6, MaPhieuMuon: 5, MaSach: 5, SoLuong: 1 },
];

export const mockPhieuTra: PhieuTra[] = [
  { MaPhieuTra: 1, MaPhieuMuon: 3, NgayTra: dayStr(-10), TienPhat: 12000 },
];

export const mockNhatKySach: NhatKySach[] = [
  {
    MaNhatKy: 1,
    MaSach: 4,
    TenSachCu: "Clean Code (v1)",
    TenSachMoi: "Clean Code",
    NgayCapNhat: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    MaNhatKy: 2,
    MaSach: 7,
    TenSachCu: "Dac Nhan Tam",
    TenSachMoi: "Đắc Nhân Tâm",
    NgayCapNhat: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
