import apiClient from "./client";
import type {
  ApiResponse,
  BaoCaoRp1,
  BaoCaoRp2,
  BaoCaoRp3,
  BaoCaoRp4,
  BaoCaoRp5,
} from "@/types/library";

export const baocaoApi = {
  getRp1: () => apiClient.get<ApiResponse<BaoCaoRp1>>("/api/baocao/rp1"),
  getRp2: () => apiClient.get<ApiResponse<BaoCaoRp2[]>>("/api/baocao/rp2"),
  getRp3: () => apiClient.get<ApiResponse<BaoCaoRp3[]>>("/api/baocao/rp3"),
  getRp4: () => apiClient.get<ApiResponse<BaoCaoRp4[]>>("/api/baocao/rp4"),
  getRp5: () => apiClient.get<ApiResponse<BaoCaoRp5[]>>("/api/baocao/rp5"),
};
