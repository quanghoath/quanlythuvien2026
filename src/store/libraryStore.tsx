import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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

  // VaiTro
  addVaiTro: (v: Omit<VaiTro, "MaVaiTro">) => void;
  updateVaiTro: (id: number, v: Partial<VaiTro>) => void;
  deleteVaiTro: (id: number) => void;

  // TaiKhoan
  addTaiKhoan: (v: Omit<TaiKhoan, "MaTaiKhoan">) => void;
  updateTaiKhoan: (id: number, v: Partial<TaiKhoan>) => void;
  deleteTaiKhoan: (id: number) => void;

  // TacGia
  addTacGia: (v: Omit<TacGia, "MaTacGia">) => void;
  updateTacGia: (id: number, v: Partial<TacGia>) => void;
  deleteTacGia: (id: number) => void;

  // TheLoai
  addTheLoai: (v: Omit<TheLoai, "MaTheLoai">) => void;
  updateTheLoai: (id: number, v: Partial<TheLoai>) => void;
  deleteTheLoai: (id: number) => void;

  // Sach
  addSach: (v: Omit<Sach, "MaSach" | "SoLuongCon"> & { SoLuongCon?: number }) => void;
  updateSach: (id: number, v: Partial<Sach>) => void;
  deleteSach: (id: number) => void;

  // DocGia
  addDocGia: (v: Omit<DocGia, "MaDocGia">) => void;
  updateDocGia: (id: number, v: Partial<DocGia>) => void;
  deleteDocGia: (id: number) => void;

  // PhieuMuon
  addPhieuMuon: (
    v: Omit<PhieuMuon, "MaPhieuMuon">,
    chiTiet: { MaSach: number; SoLuong: number }[]
  ) => void;
  updatePhieuMuon: (
    id: number,
    v: Partial<PhieuMuon>,
    chiTiet?: { MaSach: number; SoLuong: number }[]
  ) => void;
  deletePhieuMuon: (id: number) => void;

  // PhieuTra
  addPhieuTra: (v: Omit<PhieuTra, "MaPhieuTra">) => void;
  updatePhieuTra: (id: number, v: Partial<PhieuTra>) => void;
  deletePhieuTra: (id: number) => void;

  // NhatKySach
  deleteNhatKy: (id: number) => void;
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

      addVaiTro: (v) => setVaiTro((p) => [...p, { ...v, MaVaiTro: nextId(p, "MaVaiTro") }]),
      updateVaiTro: (id, v) => setVaiTro((p) => p.map((x) => (x.MaVaiTro === id ? { ...x, ...v } : x))),
      deleteVaiTro: (id) => setVaiTro((p) => p.filter((x) => x.MaVaiTro !== id)),

      addTaiKhoan: (v) => setTaiKhoan((p) => [...p, { ...v, MaTaiKhoan: nextId(p, "MaTaiKhoan") }]),
      updateTaiKhoan: (id, v) =>
        setTaiKhoan((p) => p.map((x) => (x.MaTaiKhoan === id ? { ...x, ...v } : x))),
      deleteTaiKhoan: (id) => setTaiKhoan((p) => p.filter((x) => x.MaTaiKhoan !== id)),

      addTacGia: (v) => setTacGia((p) => [...p, { ...v, MaTacGia: nextId(p, "MaTacGia") }]),
      updateTacGia: (id, v) => setTacGia((p) => p.map((x) => (x.MaTacGia === id ? { ...x, ...v } : x))),
      deleteTacGia: (id) => setTacGia((p) => p.filter((x) => x.MaTacGia !== id)),

      addTheLoai: (v) => setTheLoai((p) => [...p, { ...v, MaTheLoai: nextId(p, "MaTheLoai") }]),
      updateTheLoai: (id, v) =>
        setTheLoai((p) => p.map((x) => (x.MaTheLoai === id ? { ...x, ...v } : x))),
      deleteTheLoai: (id) => setTheLoai((p) => p.filter((x) => x.MaTheLoai !== id)),

      addSach: (v) =>
        setSach((p) => {
          const newId = nextId(p, "MaSach");
          const SoLuongCon = v.SoLuongCon ?? v.SoLuong;
          return [...p, { ...v, MaSach: newId, SoLuongCon }];
        }),
      updateSach: (id, v) =>
        setSach((p) => {
          const old = p.find((x) => x.MaSach === id);
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
          return p.map((x) => (x.MaSach === id ? { ...x, ...v } : x));
        }),
      deleteSach: (id) => setSach((p) => p.filter((x) => x.MaSach !== id)),

      addDocGia: (v) => setDocGia((p) => [...p, { ...v, MaDocGia: nextId(p, "MaDocGia") }]),
      updateDocGia: (id, v) =>
        setDocGia((p) => p.map((x) => (x.MaDocGia === id ? { ...x, ...v } : x))),
      deleteDocGia: (id) => setDocGia((p) => p.filter((x) => x.MaDocGia !== id)),

      addPhieuMuon: (v, ct) => {
        setPhieuMuon((p) => {
          const newId = nextId(p, "MaPhieuMuon");
          setChiTiet((cts) => {
            let nid = nextId(cts, "MaChiTiet");
            const added = ct.map((c) => ({
              MaChiTiet: nid++,
              MaPhieuMuon: newId,
              MaSach: c.MaSach,
              SoLuong: c.SoLuong,
            }));
            return [...cts, ...added];
          });
          // trừ SoLuongCon
          setSach((sks) =>
            sks.map((s) => {
              const found = ct.find((c) => c.MaSach === s.MaSach);
              return found ? { ...s, SoLuongCon: Math.max(0, s.SoLuongCon - found.SoLuong) } : s;
            })
          );
          return [...p, { ...v, MaPhieuMuon: newId }];
        });
      },
      updatePhieuMuon: (id, v, ct) => {
        setPhieuMuon((p) => p.map((x) => (x.MaPhieuMuon === id ? { ...x, ...v } : x)));
        if (ct) {
          // hoàn lại số lượng cũ
          setChiTiet((cts) => {
            const oldDetails = cts.filter((c) => c.MaPhieuMuon === id);
            setSach((sks) =>
              sks.map((s) => {
                const old = oldDetails.find((c) => c.MaSach === s.MaSach);
                const nw = ct.find((c) => c.MaSach === s.MaSach);
                let SoLuongCon = s.SoLuongCon;
                if (old) SoLuongCon += old.SoLuong;
                if (nw) SoLuongCon -= nw.SoLuong;
                SoLuongCon = Math.max(0, Math.min(s.SoLuong, SoLuongCon));
                return { ...s, SoLuongCon };
              })
            );
            const remain = cts.filter((c) => c.MaPhieuMuon !== id);
            let nid = nextId(cts, "MaChiTiet");
            const added = ct.map((c) => ({
              MaChiTiet: nid++,
              MaPhieuMuon: id,
              MaSach: c.MaSach,
              SoLuong: c.SoLuong,
            }));
            return [...remain, ...added];
          });
        }
      },
      deletePhieuMuon: (id) => {
        // hoàn lại số lượng nếu chưa có phiếu trả
        const hasReturn = phieuTra.some((pt) => pt.MaPhieuMuon === id);
        if (!hasReturn) {
          const details = chiTietPhieuMuon.filter((c) => c.MaPhieuMuon === id);
          setSach((sks) =>
            sks.map((s) => {
              const d = details.find((c) => c.MaSach === s.MaSach);
              return d
                ? { ...s, SoLuongCon: Math.min(s.SoLuong, s.SoLuongCon + d.SoLuong) }
                : s;
            })
          );
        }
        setChiTiet((p) => p.filter((c) => c.MaPhieuMuon !== id));
        setPhieuTra((p) => p.filter((pt) => pt.MaPhieuMuon !== id));
        setPhieuMuon((p) => p.filter((x) => x.MaPhieuMuon !== id));
      },

      addPhieuTra: (v) => {
        setPhieuTra((p) => [...p, { ...v, MaPhieuTra: nextId(p, "MaPhieuTra") }]);
        const details = chiTietPhieuMuon.filter((c) => c.MaPhieuMuon === v.MaPhieuMuon);
        setSach((sks) =>
          sks.map((s) => {
            const d = details.find((c) => c.MaSach === s.MaSach);
            return d ? { ...s, SoLuongCon: Math.min(s.SoLuong, s.SoLuongCon + d.SoLuong) } : s;
          })
        );
      },
      updatePhieuTra: (id, v) =>
        setPhieuTra((p) => p.map((x) => (x.MaPhieuTra === id ? { ...x, ...v } : x))),
      deletePhieuTra: (id) => {
        const pt = phieuTra.find((x) => x.MaPhieuTra === id);
        if (pt) {
          const details = chiTietPhieuMuon.filter((c) => c.MaPhieuMuon === pt.MaPhieuMuon);
          setSach((sks) =>
            sks.map((s) => {
              const d = details.find((c) => c.MaSach === s.MaSach);
              return d ? { ...s, SoLuongCon: Math.max(0, s.SoLuongCon - d.SoLuong) } : s;
            })
          );
        }
        setPhieuTra((p) => p.filter((x) => x.MaPhieuTra !== id));
      },

      deleteNhatKy: (id) => setNhatKy((p) => p.filter((x) => x.MaNhatKy !== id)),
    }),
    [vaiTro, taiKhoan, tacGia, theLoai, sach, docGia, phieuMuon, chiTietPhieuMuon, phieuTra, nhatKySach]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
