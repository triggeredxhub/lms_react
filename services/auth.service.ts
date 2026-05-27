import { api } from "@/lib/api";
import { AuthSource, LoginResponse } from "@/models/auth/LoginResponse.model";
import { User, UserRole } from "@/models/auth/User.model";

async function loginWithEndpoint(
  endpoint: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  return await api.post(endpoint, { email, password });
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginStudent(email, password);
}

export async function loginStudent(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginWithEndpoint("/api/user/login", email, password);
}

export async function loginHris(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginWithEndpoint("/api/hris_user/login_hris", email, password);
}

export async function loginByRole(
  role: UserRole,
  email: string,
  password: string,
): Promise<LoginResponse> {
  return role === "student"
    ? loginStudent(email, password)
    : loginHris(email, password);
}

export async function getCurrentUser(source: AuthSource): Promise<User> {
  const endpoint = source === "ems" ? "/api/user/me" : "/api/hris_user/me";
  return api.get(endpoint, {}, true);
}
