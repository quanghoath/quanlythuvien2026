import apiClient from "./client";
import type { ApiResponse, TheLoai } from "@/types/library";

export const theloaiApi = {
  getAll: () => apiClient.get<ApiResponse<TheLoai[]>>("/api/theloai"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/theloai", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/theloai/${id}`),
};
