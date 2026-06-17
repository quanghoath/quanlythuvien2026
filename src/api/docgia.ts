import apiClient from "./client";
import type { ApiResponse, DocGia } from "@/types/library";

export const docgiaApi = {
  getAll: () => apiClient.get<ApiResponse<DocGia[]>>("/api/docgia"),

  createOrUpdate: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<null>>("/api/docgia", data),

  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`/api/docgia/${id}`),
};
