import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
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
import {
  mockChiTietPhieuMuon,
  mockDocGia,
  mockNhatKySach,
  mockPhieuMuon,
  mockPhieuTra,
  mockSach,
  mockTacGia,
  mockTaiKhoan,
  mockTheLoai,
  mockVaiTro,
} from "@/data/mockData";
import { sachApi } from "@/api/sach";
import { tacgiaApi } from "@/api/tacgia";
import { theloaiApi } from "@/api/theloai";
import { docgiaApi } from "@/api/docgia";
import { phieumuonApi } from "@/api/phieumuon";
import { phieutraApi } from "@/api/phieutra";
import { nhatkyApi } from "@/api/nhatky";
import { taikhoanApi } from "@/api/taikhoan";

type LibraryContextValue = {
  vaiTro: VaiTro[];
  taiKhoan: TaiKhoan[];
  tacGia: TacGia[];
  theLoai: TheLoai[];
  sach: Sach[];
  docGia: DocGia[];
  phieuMuon: PhieuMuon[];
  chiTietPhieuMuon: ChiTietPhieuMuon[];
  phieuTra: PhieuTra[];
  nhatKySach: NhatKySach[];

  addVaiTro: (v: Omit<VaiTro, "MaVaiTro">) => void;
  updateVaiTro: (id: number, v: Partial<VaiTro>) => void;
  deleteVaiTro: (id: number) => void;

  addTaiKhoan: (v: Omit<TaiKhoan, "MaTaiKhoan">) => Promise<void>;
  updateTaiKhoan: (id: number, v: Partial<TaiKhoan>) => Promise<void>;
  deleteTaiKhoan: (id: number) => Promise<void>;

  addTacGia: (v: Omit<TacGia, "MaTacGia">) => Promise<void>;
  updateTacGia: (id: number, v: Partial<TacGia>) => Promise<void>;
  deleteTacGia: (id: number) => Promise<void>;

  addTheLoai: (v: Omit<TheLoai, "MaTheLoai">) => Promise<void>;
  updateTheLoai: (id: number, v: Partial<TheLoai>) => Promise<void>;
  deleteTheLoai: (id: number) => Promise<void>;

  addSach: (v: Omit<Sach, "MaSach" | "SoLuongCon"> & { SoLuongCon?: number }) => Promise<void>;
  updateSach: (id: number, v: Partial<Sach>) => Promise<void>;
  deleteSach: (id: number) => Promise<void>;

  addDocGia: (v: Omit<DocGia, "MaDocGia">) => Promise<void>;
  updateDocGia: (id: number, v: Partial<DocGia>) => Promise<void>;
  deleteDocGia: (id: number) => Promise<void>;

  addPhieuMuon: (
    v: Omit<PhieuMuon, "MaPhieuMuon">,
    chiTiet: { MaSach: number; SoLuong: number }[],
  ) => Promise<void>;
  updatePhieuMuon: (
    id: number,
    v: Partial<PhieuMuon>,
    chiTiet?: { MaSach: number; SoLuong: number }[],
  ) => Promise<void>;
  deletePhieuMuon: (id: number) => Promise<void>;

  addPhieuTra: (v: Omit<PhieuTra, "MaPhieuTra">) => Promise<void>;
  updatePhieuTra: (id: number, v: Partial<PhieuTra>) => Promise<void>;
  deletePhieuTra: (id: number) => Promise<void>;

  deleteNhatKy: (id: number) => Promise<void>;

  refetchAll: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const nextId = <T extends Record<string, unknown>>(arr: T[], key: keyof T): number => {
  return arr.reduce((max, x) => Math.max(max, Number(x[key] ?? 0)), 0) + 1;
};

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [vaiTro, setVaiTro] = useState<VaiTro[]>(mockVaiTro);
  const [taiKhoan, setTaiKhoan] = useState<TaiKhoan[]>(mockTaiKhoan);
  const [tacGia, setTacGia] = useState<TacGia[]>(mockTacGia);
  const [theLoai, setTheLoai] = useState<TheLoai[]>(mockTheLoai);
  const [sach, setSach] = useState<Sach[]>(mockSach);
  const [docGia, setDocGia] = useState<DocGia[]>(mockDocGia);
  const [phieuMuon, setPhieuMuon] = useState<PhieuMuon[]>(mockPhieuMuon);
  const [chiTietPhieuMuon, setChiTiet] = useState<ChiTietPhieuMuon[]>(mockChiTietPhieuMuon);
  const [phieuTra, setPhieuTra] = useState<PhieuTra[]>(mockPhieuTra);
  const [nhatKySach, setNhatKy] = useState<NhatKySach[]>(mockNhatKySach);

  const refetchAll = useCallback(async () => {
    try {
      const [sRes, tgRes, tlRes, dgRes, pmRes, ptRes, nkRes, tkRes] = await Promise.allSettled([
        sachApi.getAll(),
        tacgiaApi.getAll(),
        theloaiApi.getAll(),
        docgiaApi.getAll(),
        phieumuonApi.getAll(),
        phieutraApi.getAll(),
        nhatkyApi.getAll(),
        taikhoanApi.getAll(),
      ]);
      if (sRes.status === "fulfilled" && sRes.value.data.status === 2000)
        setSach(sRes.value.data.data);
      if (tgRes.status === "fulfilled" && tgRes.value.data.status === 2000)
        setTacGia(tgRes.value.data.data);
      if (tlRes.status === "fulfilled" && tlRes.value.data.status === 2000)
        setTheLoai(tlRes.value.data.data);
      if (dgRes.status === "fulfilled" && dgRes.value.data.status === 2000)
        setDocGia(dgRes.value.data.data);
      if (pmRes.status === "fulfilled" && pmRes.value.data.status === 2000)
        setPhieuMuon(pmRes.value.data.data);
      if (ptRes.status === "fulfilled" && ptRes.value.data.status === 2000)
        setPhieuTra(ptRes.value.data.data);
      if (nkRes.status === "fulfilled" && nkRes.value.data.status === 2000)
        setNhatKy(nkRes.value.data.data);
      if (tkRes.status === "fulfilled" && tkRes.value.data.status === 2000)
        setTaiKhoan(tkRes.value.data.data);
    } catch {
      // Fall back to mock data
    }
  }, []);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  const value = useMemo<LibraryContextValue>(
    () => ({
      vaiTro,
      taiKhoan,
      tacGia,
      theLoai,
      sach,
      docGia,
      phieuMuon,
      chiTietPhieuMuon,
      phieuTra,
      nhatKySach,
      refetchAll,

      addVaiTro: (v) => setVaiTro((p) => [...p, { ...v, MaVaiTro: nextId(p, "MaVaiTro") }]),
      updateVaiTro: (id, v) =>
        setVaiTro((p) => p.map((x) => (x.MaVaiTro === id ? { ...x, ...v } : x))),
      deleteVaiTro: (id) => setVaiTro((p) => p.filter((x) => x.MaVaiTro !== id)),

      addTaiKhoan: async (v) => {
        const { data } = await taikhoanApi.createOrUpdate({
          tenTaiKhoan: v.TenDangNhap,
          hoTen: v.HoTen,
          matKhau: v.MatKhau,
          maVaiTro: v.MaVaiTro,
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updateTaiKhoan: async (id, v) => {
        const { data } = await taikhoanApi.createOrUpdate({
          maTaiKhoan: id,
          tenTaiKhoan: v.TenDangNhap ?? "",
          hoTen: v.HoTen ?? "",
          matKhau: v.MatKhau ?? "",
          maVaiTro: v.MaVaiTro ?? 0,
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      deleteTaiKhoan: async (id) => {
        const { data } = await taikhoanApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addTacGia: async (v) => {
        const { data } = await tacgiaApi.createOrUpdate({ tenTacGia: v.TenTacGia });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updateTacGia: async (id, v) => {
        const { data } = await tacgiaApi.createOrUpdate({
          maTacGia: id,
          tenTacGia: v.TenTacGia ?? "",
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      deleteTacGia: async (id) => {
        const { data } = await tacgiaApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addTheLoai: async (v) => {
        const { data } = await theloaiApi.createOrUpdate({ tenTheLoai: v.TenTheLoai });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updateTheLoai: async (id, v) => {
        const { data } = await theloaiApi.createOrUpdate({
          maTheLoai: id,
          tenTheLoai: v.TenTheLoai ?? "",
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      deleteTheLoai: async (id) => {
        const { data } = await theloaiApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addSach: async (v) => {
        const { data } = await sachApi.createOrUpdate({
          maSach: null,
          tenSach: v.TenSach,
          maTacGia: v.MaTacGia,
          maTheLoai: v.MaTheLoai,
          namXuatBan: v.NamXuatBan ?? new Date().getFullYear(),
          soLuong: v.SoLuong,
          soLuongCon: v.SoLuongCon ?? v.SoLuong,
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updateSach: async (id, v) => {
        const old = sach.find((x) => x.MaSach === id);
        const { data } = await sachApi.createOrUpdate({
          maSach: id,
          tenSach: v.TenSach ?? old?.TenSach ?? "",
          maTacGia: v.MaTacGia ?? old?.MaTacGia ?? 0,
          maTheLoai: v.MaTheLoai ?? old?.MaTheLoai ?? 0,
          namXuatBan: v.NamXuatBan ?? old?.NamXuatBan ?? new Date().getFullYear(),
          soLuong: v.SoLuong ?? old?.SoLuong ?? 0,
          soLuongCon: v.SoLuongCon ?? old?.SoLuongCon ?? 0,
        });
        if (data.status === 2000) {
          if (old && v.TenSach && v.TenSach !== old.TenSach) {
            setNhatKy((nk) => [
              ...nk,
              {
                MaNhatKy: nextId(nk, "MaNhatKy"),
                MaSach: id,
                TenSachCu: old.TenSach,
                TenSachMoi: v.TenSach,
                NgayCapNhat: new Date().toISOString(),
              },
            ]);
          }
          await refetchAll();
        } else throw new Error(data.message);
      },
      deleteSach: async (id) => {
        const { data } = await sachApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addDocGia: async (v) => {
        const { data } = await docgiaApi.createOrUpdate({
          hoTen: v.HoTen,
          soDienThoai: v.SoDienThoai ?? "",
          diaChi: v.DiaChi ?? "",
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updateDocGia: async (id, v) => {
        const old = docGia.find((x) => x.MaDocGia === id);
        const { data } = await docgiaApi.createOrUpdate({
          maDocGia: id,
          hoTen: v.HoTen ?? old?.HoTen ?? "",
          soDienThoai: v.SoDienThoai ?? old?.SoDienThoai ?? "",
          diaChi: v.DiaChi ?? old?.DiaChi ?? "",
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      deleteDocGia: async (id) => {
        const { data } = await docgiaApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addPhieuMuon: async (v, ct) => {
        const { data } = await phieumuonApi.create({
          maDocGia: v.MaDocGia,
          ngayMuon: v.NgayMuon,
          hanTra: v.HanTra,
          danhSach: ct.map((c) => ({ maSach: c.MaSach, soLuong: c.SoLuong })),
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updatePhieuMuon: async () => {
        throw new Error("Không hỗ trợ sửa phiếu mượn");
      },
      deletePhieuMuon: async (id) => {
        const { data } = await phieumuonApi.remove(id);
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },

      addPhieuTra: async (v) => {
        const pm = phieuMuon.find((x) => x.MaPhieuMuon === v.MaPhieuMuon);
        const { data } = await phieutraApi.createOrUpdate({
          maPhieuMuon: v.MaPhieuMuon,
          maDocGia: pm?.MaDocGia ?? 0,
          ngayTra: v.NgayTra,
          tienPhat: v.TienPhat,
        });
        if (data.status === 2000) await refetchAll();
        else throw new Error(data.message);
      },
      updatePhieuTra: async () => {
        throw new Error("Không hỗ trợ sửa phiếu trả");
      },
      deletePhieuTra: async () => {
        throw new Error("Không được phép xoá phiếu trả");
      },

      deleteNhatKy: async () => {
        // NhatKy is read-only from API
      },
    }),
    [
      vaiTro,
      taiKhoan,
      tacGia,
      theLoai,
      sach,
      docGia,
      phieuMuon,
      chiTietPhieuMuon,
      phieuTra,
      nhatKySach,
      refetchAll,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
