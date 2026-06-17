import apiClient from "./client";
import type { ApiResponse, TacGia } from "@/types/library";

export const tacgiaApi = {
  getAll: () => apiClient.get<ApiResponse<TacGia[]>>("/api/tacgia"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/tacgia", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/tacgia/${id}`),
};
