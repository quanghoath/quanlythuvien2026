import apiClient from "./client";

export const authApi = {
  login: (payload: { tenDangNhap: string; password: string }) =>
    apiClient.post("/api/login", payload),
};
