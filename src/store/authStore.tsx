import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { TaiKhoan } from "@/types/library";
import apiClient from "@/api/client";

const TOKEN_KEY = "token";
const USER_KEY = "library_user";

type AuthContextValue = {
  currentUser: TaiKhoan | null;
  login: (tenDangNhap: string, matKhau: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<TaiKhoan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        const raw = sessionStorage.getItem(USER_KEY);
        if (raw) {
          const u = JSON.parse(raw) as TaiKhoan;
          setCurrentUser(u);
        }
      }
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const login = useCallback(async (tenDangNhap: string, matKhau: string) => {
    try {
      const { data } = await apiClient.post("/api/login", {
        tenDangNhap: tenDangNhap.trim(),
        password: matKhau,
      });
      if (data.status === 2000) {
        sessionStorage.setItem(TOKEN_KEY, data.acessToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.data));
        setCurrentUser(data.data);
        return { ok: true, message: data.message };
      }
      return { ok: false, message: data.message ?? "Đăng nhập thất bại" };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Không thể kết nối đến máy chủ";
      return { ok: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setCurrentUser(null);
  }, []);

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
