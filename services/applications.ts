import api from "@/lib/axios";
import { ApiResponse, Application } from "@/types";

export const applicationService = {
  getAll: async (): Promise<ApiResponse<Application[]>> => {
    const response = await api.get("/applications");
    return response.data;
  },

  create: async (data: Partial<Application>): Promise<ApiResponse<Application>> => {
    const response = await api.post("/applications", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Application>): Promise<ApiResponse<Application>> => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<Application>> => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};