import { api } from "@/lib/api";
import { LoginResponse } from "@/models/auth/LoginResponse.model";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return await api.post("/api/user/login", { email, password });
}
