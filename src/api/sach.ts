import apiClient from "./client";
import type { ApiResponse, Sach } from "@/types/library";

export const sachApi = {
  getAll: () => apiClient.get<ApiResponse<Sach[]>>("/api/sach"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/sach", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/sach/${id}`),
};
