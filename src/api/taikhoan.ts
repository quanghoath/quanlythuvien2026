import apiClient from "./client";
import type { ApiResponse, TaiKhoan } from "@/types/library";

export const taikhoanApi = {
  getAll: () => apiClient.get<ApiResponse<TaiKhoan[]>>("/api/taikhoan"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/taikhoan", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/taikhoan/${id}`),
};
