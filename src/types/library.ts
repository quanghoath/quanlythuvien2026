// ===== Generic API Response =====
export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message: string;
};

// ===== Models khớp API Backend =====

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

export type CreateTaiKhoan = {
  MaVaiTro?: number | null;
  MaTaiKhoan?: number | null;
  TenDangNhap: string;
  HoTen: string;
  MatKhau: string;
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

export type PhieuMuonState = "NEW" | "RETURNED" | "OVERDUE" | string;

export type PhieuMuon = {
  MaPhieuMuon: number;
  MaDocGia?: number;
  TenDocGia?: string | number;
  NgayMuon: string; // ISO datetime
  HanTra: string;
  State?: PhieuMuonState;
  SoLuongSach?: number;
};

export type PhieuMuonChiTietItem = {
  MaSach: number;
  TenSach?: string;
  SoLuong: number;
};

export type PhieuMuonDetail = {
  data: PhieuMuon;
  details: PhieuMuonChiTietItem[];
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

// ===== Login =====
export type LoginPayload = {
  tenDangNhap: string;
  password: string;
};

export type LoginResponse = {
  acessToken: string;
  refreshToken: string;
  expires: string;
  status: number;
  data: TaiKhoan;
  message: string;
};

// ===== Báo cáo =====
export type BaoCaoRp1 = {
  tenTheLoai: string;
  soLuongSach: number;
  soLuotMuon: number;
};

export type BaoCaoRp2 = {
  tenSach: string;
  tenTacGia: string;
  soLuotMuon: number;
};

export type BaoCaoRp3 = {
  tenDocGia: string;
  soLuotMuon: number;
};

export type BaoCaoRp4 = {
  thang: string;
  soLuotMuon: number;
  soLuotTra: number;
};

// ===== Tinh tien phat =====
export type TinhTienPhatRequest = {
  hanTra: string;
  ngayTra: string;
};
