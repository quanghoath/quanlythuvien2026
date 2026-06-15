import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TaiKhoan } from "@/types/library";
import { mockTaiKhoan } from "@/data/mockData";

const STORAGE_KEY = "library_current_user_id";

type AuthContextValue = {
  currentUser: TaiKhoan | null;
  login: (tenDangNhap: string, matKhau: string) => { ok: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<TaiKhoan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const id = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (id) {
        const u = mockTaiKhoan.find((x) => x.MaTaiKhoan === Number(id));
        if (u) setCurrentUser(u);
      }
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const login = (tenDangNhap: string, matKhau: string) => {
    const u = mockTaiKhoan.find(
      (x) => x.TenDangNhap.toLowerCase() === tenDangNhap.trim().toLowerCase() && x.MatKhau === matKhau
    );
    if (!u) return { ok: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." };
    setCurrentUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, String(u.MaTaiKhoan));
    } catch {
      /* noop */
    }
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
