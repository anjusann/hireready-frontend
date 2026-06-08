import api from "@/lib/axios";
import { ApiResponse, AuthResponse, User } from "@/types";

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/profile");
    return response.data;
  },
};