import apiClient from "./client";
import type { ApiResponse, PhieuTra, TinhTienPhatRequest } from "@/types/library";

export const phieutraApi = {
  getAll: () => apiClient.get<ApiResponse<PhieuTra[]>>("/api/phieutra"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/phieutra", data),

  tinhTienPhat: (data: TinhTienPhatRequest) =>
    apiClient.post<ApiResponse<number>>("/api/tinh-tien-phat", data),
};
