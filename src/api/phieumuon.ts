import apiClient from "./client";
import type { ApiResponse, PhieuMuon, PhieuMuonChiTietItem } from "@/types/library";

export const phieumuonApi = {
  getAll: () => apiClient.get<ApiResponse<PhieuMuon[]>>("/api/phieumuon"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<{ data: PhieuMuon; details: PhieuMuonChiTietItem[] }>>(
      `/api/phieumuon/${id}`,
    ),

  create: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/phieumuon", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/phieumuon/${id}`),
};
