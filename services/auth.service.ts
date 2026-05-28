import { api } from "@/lib/api";
import { AuthSource, LoginResponse } from "@/models/auth/LoginResponse.model";
import { User, UserRole } from "@/models/auth/User.model";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

function resolveAuthPayload(record: Record<string, unknown>) {
  const dataRecord = asRecord(record.data);
  const resultRecord = asRecord(record.result);

  return dataRecord ?? resultRecord ?? record;
}

function normalizeLoginResponse(response: unknown): LoginResponse {
  const topLevel = asRecord(response);

  if (!topLevel) {
    throw new Error("Invalid login response from server.");
  }

  const payload = resolveAuthPayload(topLevel);
  const payloadTokens = asRecord(payload.tokens);

  const tokenCandidate =
    pickString(payload, ["accessToken", "access_token", "token"]) ??
    (payloadTokens
      ? pickString(payloadTokens, ["accessToken", "access_token", "token"])
      : null);

  if (typeof tokenCandidate !== "string" || tokenCandidate.length === 0) {
    throw new Error(
      `Authentication token is missing in login response. Received keys: ${Object.keys(
        payload,
      ).join(", ")}`,
    );
  }

  const userCandidateRecord = asRecord(payload.user) ?? payload;

  const refreshTokenCandidate =
    pickString(payload, ["refreshToken", "refresh_token"]) ??
    (payloadTokens
      ? pickString(payloadTokens, ["refreshToken", "refresh_token"])
      : null);

  return {
    accessToken: tokenCandidate,
    refreshToken: refreshTokenCandidate,
    source: "lms",
    token: tokenCandidate,
    user: userCandidateRecord as unknown as User,
  };
}

async function loginWithEndpoint(
  endpoint: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post(endpoint, { email, password });
  return normalizeLoginResponse(response);
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginAuto(email, password);
}

export async function loginStudent(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginWithEndpoint("/auth/login", email, password);
}

export async function loginHris(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginWithEndpoint("/auth/login", email, password);
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

export async function loginAuto(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return loginWithEndpoint("/auth/login", email, password);
}

export async function getCurrentUser(source: AuthSource): Promise<User> {
  void source;
  return api.get("/users/me", {}, true);
}
