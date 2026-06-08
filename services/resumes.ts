import api from "@/lib/axios";
import { ApiResponse, Resume } from "@/types";

export const resumeService = {
  getAll: async (): Promise<ApiResponse<Resume[]>> => {
    const response = await api.get("/resumes");
    return response.data;
  },

  upload: async (formData: FormData): Promise<ApiResponse<Resume>> => {
    const response = await api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  setPrimary: async (id: number): Promise<ApiResponse<Resume>> => {
    const response = await api.post(`/resumes/${id}/set-primary`);
    return response.data;
  },
};