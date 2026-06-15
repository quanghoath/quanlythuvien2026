export type VaiTro = {
  MaVaiTro: number;
  TenVaiTro: string;
};

export type TaiKhoan = {
  MaTaiKhoan: number;
  TenDangNhap: string;
  MatKhau: string;
  HoTen: string;
  MaVaiTro: number;
};

export type TacGia = {
  MaTacGia: number;
  TenTacGia: string;
};

export type TheLoai = {
  MaTheLoai: number;
  TenTheLoai: string;
};

export type Sach = {
  MaSach: number;
  TenSach: string;
  MaTacGia: number;
  MaTheLoai: number;
  NamXuatBan?: number | null;
  SoLuong: number;
  SoLuongCon: number;
};

export type DocGia = {
  MaDocGia: number;
  HoTen: string;
  SoDienThoai?: string;
  DiaChi?: string;
};

export type ChiTietPhieuMuon = {
  MaChiTiet: number;
  MaPhieuMuon: number;
  MaSach: number;
  SoLuong: number;
};

export type PhieuMuon = {
  MaPhieuMuon: number;
  MaDocGia: number;
  NgayMuon: string; // YYYY-MM-DD
  HanTra: string;
};

export type PhieuTra = {
  MaPhieuTra: number;
  MaPhieuMuon: number;
  NgayTra: string;
  TienPhat: number;
};

export type NhatKySach = {
  MaNhatKy: number;
  MaSach: number | null;
  TenSachCu?: string;
  TenSachMoi?: string;
  NgayCapNhat: string; // ISO datetime
};
