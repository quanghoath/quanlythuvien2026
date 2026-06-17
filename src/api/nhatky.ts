import apiClient from "./client";
import type { ApiResponse, NhatKySach } from "@/types/library";

export const nhatkyApi = {
  getAll: () => apiClient.get<ApiResponse<NhatKySach[]>>("/api/nhatkysach"),
};
